// Utility function to convert numbers to words (optional)
function convertNumberToWords(amount: number): string {
  const words = require("number-to-words"); // Install this package: npm install number-to-words
  return words.toWords(amount).toUpperCase() + " PESOS";
}

export default convertNumberToWords;
