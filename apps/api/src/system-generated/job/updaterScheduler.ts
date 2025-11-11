import cron from "node-cron";
import { exec } from "child_process";
import path from "path";

// Executes the Python updater runner script every 1 minute for testing purposes
cron.schedule("* * * * *", () => {
  console.log("Running Python Updater...");

  // Log the current working directory and resolved path for debugging
  console.log("Current working directory:", process.cwd());
  const scriptPath = path.resolve(__dirname, "../../ml/run_updater.py");
  console.log("Resolved path:", scriptPath);

  exec(`python ${scriptPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
});

// Executes the Python updater runner script every 30 days
// cron.schedule("0 0 */30 * *", () => {
//   console.log("Running Python Updater...");

//   // Log the current working directory and resolved path for debugging
//   console.log("Current working directory:", process.cwd());
//   const scriptPath = path.resolve(__dirname, "../../ml/run_updater.py");
//   console.log("Resolved path:", scriptPath);

//   exec(`python ${scriptPath}`, (error, stdout, stderr) => {
//     if (error) {
//       console.error(`Error: ${error.message}`);
//       return;
//     }
//     if (stderr) {
//       console.error(`stderr: ${stderr}`);
//       return;
//     }
//     console.log(`stdout: ${stdout}`);
//   });
// });
