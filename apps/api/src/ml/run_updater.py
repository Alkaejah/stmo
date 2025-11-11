import os
import subprocess
import sys

# Path to the Python executable in the virtual environment
python_executable = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../../venv/Scripts/python.exe'))

# Path to the updater script
updater_script_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "dss_assignment_updater.py"))

# Debugging: Print the paths
print(f"Python executable: {python_executable}")
print(f"Updater script path: {updater_script_path}")

# Check if the Python executable exists
if not os.path.exists(python_executable):
    print(f"Error: Python executable not found at {python_executable}")
    sys.exit(1)

# Check if the updater script exists
if not os.path.exists(updater_script_path):
    print(f"Error: Updater script not found at {updater_script_path}")
    sys.exit(1)

# Construct the command to run the updater script using the virtual environment's Python executable
command = [python_executable, updater_script_path]

# Debugging: Print the full command
print(f"Full command: {command}")

# Set the working directory to the script's directory
os.chdir(os.path.dirname(updater_script_path))

try:
    # Use subprocess to run the command
    process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    stdout, stderr = process.communicate()

    if process.returncode != 0:
        print(f"Error during execution:\n{stderr}")
    else:
        print(f"Script executed successfully:\n{stdout}")
except Exception as e:
    print(f"Unexpected error: {str(e)}")
