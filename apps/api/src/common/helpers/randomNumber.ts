import CryptoJS from "crypto-js";

const randomNumber = () => {
  const randomBytes = CryptoJS.lib.WordArray.random(8);
  const randomHash = CryptoJS.SHA256(randomBytes.toString(CryptoJS.enc.Hex));
  const normalizedFloat =
    parseInt(randomHash.toString(CryptoJS.enc.Hex), 16) / Math.pow(2, 256);
  return normalizedFloat;
};

export default randomNumber;
