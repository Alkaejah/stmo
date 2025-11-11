import CryptoJS from "crypto-js";
import {
  BACKOFFICE_CSRF_SIGN_KEY,
  BACKOFFICE_PASSWORD_ENCRYPT_KEY,
  CSRF_SIGN_KEY,
  PASSWORD_ENCRYPT_KEY,
} from "./config";

export class EncryptionService {
  private KEY: string | undefined;
  constructor(
    source: "password" | "csrf" | "backOfficeCsrf" | "backOfficePassword",
  ) {
    if (source === "password") {
      this.KEY = PASSWORD_ENCRYPT_KEY;
    } else if (source === "csrf") {
      this.KEY = CSRF_SIGN_KEY;
    } else if (source === "backOfficeCsrf") {
      this.KEY = BACKOFFICE_CSRF_SIGN_KEY;
    } else if (source === "backOfficePassword") {
      this.KEY = BACKOFFICE_PASSWORD_ENCRYPT_KEY;
    }
  }

  encrypt(val: object | any[] | string) {
    let encryptValue = "";
    if (typeof val === "object" || Array.isArray(val)) {
      encryptValue = String(
        CryptoJS.AES.encrypt(JSON.stringify(val), String(this.KEY)),
      );
    }
    if (typeof val === "string") {
      encryptValue = String(CryptoJS.AES.encrypt(val, String(this.KEY)));
    }
    return encryptValue;
  }

  decrypt(encryptedValue: string): object | any[] | string {
    let decryptedValue = "";
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedValue, String(this.KEY));
      const originalValue = bytes.toString(CryptoJS.enc.Utf8);
      const parsedValue = JSON.parse(originalValue);

      if (Array.isArray(parsedValue)) {
        decryptedValue = JSON.stringify(parsedValue);
      } else if (parsedValue && typeof parsedValue === "object") {
        decryptedValue = parsedValue;
      }
    } catch (error: any) {
      try {
        const bytes = CryptoJS.AES.decrypt(encryptedValue, String(this.KEY));
        decryptedValue = bytes.toString(CryptoJS.enc.Utf8);
      } catch (error: any) {
        decryptedValue = "";
      }
    }

    return decryptedValue;
  }
}
