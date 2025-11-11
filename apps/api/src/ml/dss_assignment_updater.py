import joblib
import pymongo
import pandas as pd
import sys
from bson import ObjectId

# --- Configuration ---
MONGO_URI = "mongodb+srv://devlian:%403ynXurfR@stmo.n53bh.mongodb.net/etravio-db-personal?retryWrites=true&w=majority"
DB_NAME = "etravio-db-personal"
BACKOFFICERS_COLLECTION = "backofficers"
TICKETS_COLLECTION = "tickets"
VIOLATIONS_COLLECTION = "violations"
VIOLATION_ADDRESS_COLLECTION = "violationaddresses"
MODEL_PATH = "dtc_model_20250324_151141.joblib"

# --- Connect to MongoDB ---
client = pymongo.MongoClient(MONGO_URI)
db = client[DB_NAME]
backofficers_col = db[BACKOFFICERS_COLLECTION]
tickets_col = db[TICKETS_COLLECTION]
violations_col = db[VIOLATIONS_COLLECTION]
va_col = db[VIOLATION_ADDRESS_COLLECTION]

# --- Load the Trained Model ---
try:
    model = joblib.load(MODEL_PATH)
    print("Model loaded.")
except Exception as e:
    print(f"Error loading model: {e}")
    sys.exit(1)

# --- Retrieve Ticket Data ---
tickets = list(tickets_col.find())
records = []

for ticket in tickets:
    enforcer = ticket.get("enforcer")
    if not enforcer:
        continue
    if not isinstance(enforcer, dict):
        enforcer = backofficers_col.find_one({"_id": enforcer})
    if not enforcer:
        continue

    enforcer_name = f"{enforcer.get('firstName', '')} {enforcer.get('lastName', '')}".strip()
    assignment_obj = enforcer.get("assignment")
    current_assignment = ""

    if assignment_obj and isinstance(assignment_obj, list) and len(assignment_obj) > 0:
        first_assignment_id = assignment_obj[0]
        if isinstance(first_assignment_id, ObjectId):
            assignment_doc = va_col.find_one({"_id": first_assignment_id})
            if assignment_doc:
                street = assignment_doc.get("street", {}).get("street", "")
                barangay = assignment_doc.get("barangay", {}).get("barangay", "")
                current_assignment = f"{street} - {barangay}"

    for violation in ticket.get("violations", []):
        violation_id = violation.get("violationId")
        if not isinstance(violation_id, dict):
            violation_doc = violations_col.find_one({"_id": violation_id})
            if not violation_doc:
                continue
            violation_id = violation_doc
        violation_code = violation_id.get("violationCode", "").strip()
        if not violation_code:
            continue
        records.append({
            "Enforcer ID": enforcer["_id"],
            "Enforcer Name": enforcer_name,
            "Violation Code": violation_code,
            "Assignment": current_assignment
        })

if not records:
    print("No valid records.")
    sys.exit(0)

df = pd.DataFrame(records)
violation_counts = df.groupby(["Enforcer ID", "Enforcer Name"])["Violation Code"].value_counts().unstack(fill_value=0).reset_index()
assignment_mode = df.groupby(["Enforcer ID", "Enforcer Name"])["Assignment"].agg(lambda x: x.mode()[0] if not x.mode().empty else "").reset_index()
agg_data = pd.merge(violation_counts, assignment_mode, on=["Enforcer ID", "Enforcer Name"])
X = agg_data.drop(["Enforcer ID", "Enforcer Name", "Assignment"], axis=1)
predictions = model.predict(X)
agg_data["Predicted Assignment"] = predictions

print("\nPredictions:")
print(agg_data[["Enforcer Name", "Predicted Assignment"]])

for _, row in agg_data.iterrows():
    enforcer_id = row["Enforcer ID"]
    predicted_assignment_str = row["Predicted Assignment"]
    assignment_obj_id = None

    parts = predicted_assignment_str.split(" - ")
    if len(parts) == 2:
        street_val = parts[0].strip()
        barangay_val = parts[1].strip()
        va_doc = va_col.find_one({
            "street.street": street_val,
            "barangay.barangay": barangay_val
        })
        if va_doc:
            assignment_obj_id = va_doc["_id"]
            print(f"Found assignment ObjectId for '{predicted_assignment_str}': {assignment_obj_id}")

    if assignment_obj_id:
        result = backofficers_col.update_one(
            {"_id": enforcer_id},
            {"$push": {"assignment": assignment_obj_id}}  # ✅ allow duplicates
        )
        print(f"Updated {row['Enforcer Name']}: modified {result.modified_count} document(s).")

print("\nAssignment update complete.")
