// Function to generate a random string with uppercase letters and numbers
function generateRandomCode(length: number) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomPart = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomPart += characters[randomIndex];
  }

  return randomPart;
}

export default generateRandomCode;
