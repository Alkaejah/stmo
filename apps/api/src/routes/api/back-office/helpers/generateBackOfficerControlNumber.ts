import dbBackOfficers from "@/models/dbBackOfficers";

async function generateBackOfficerControlNumber(role: string): Promise<string> {
  const yearSuffix = new Date().getFullYear().toString().slice(-2); // e.g., "25"

  let prefix = "";
  if (role === "Admin") {
    prefix = "ACN";
  } else if (role === "Enforcer") {
    prefix = "ECN";
  } else if (role === "Treasurer") {
    prefix = "TCN";
  } else {
    throw new Error("Invalid role");
  }

  const count = await dbBackOfficers.countDocuments({ role });
  const paddedNumber = String(count + 1).padStart(2, "0"); // 2-digit count: "01", "02", ...

  return `${prefix}-${paddedNumber}${yearSuffix}`; // e.g., ECN-0125
}

export default generateBackOfficerControlNumber;

// OLD GENERATE CONTROL NUMBER LOGIC
// Function to generate a unique back officer control number based on the role
// function generateBackOfficerControlNumber(role: string) {
//   const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
//   let randomPart = "";

//   // Generate random part of the control number
//   for (let i = 0; i < 5; i++) {
//     const randomIndex = Math.floor(Math.random() * characters.length);
//     randomPart += characters[randomIndex];
//   }

//   // Prefix based on the role
//   let prefix = "";
//   if (role === "Admin") {
//     prefix = "ACN";
//   } else if (role === "Enforcer") {
//     prefix = "ECN";
//   } else if (role === "Treasurer") {
//     prefix = "TCN";
//   }

//   return `${prefix}-${randomPart}`;
// }

// export default generateBackOfficerControlNumber;
