import dbReceipts from "@/models/dbReceipts";

const MAX_RECEIPT_NUMBER = 999_999_999;

const generateReceiptNumber = async (): Promise<string> => {
  let receiptNumber: string = "000000001";
  let isUnique = false;

  while (!isUnique) {
    const lastReceipt = await dbReceipts.findOne().sort({ receiptNumber: -1 });

    if (lastReceipt && lastReceipt.receiptNumber) {
      let nextNumber = parseInt(lastReceipt.receiptNumber, 10) + 1;

      if (nextNumber > MAX_RECEIPT_NUMBER) {
        nextNumber = 1;
      }

      receiptNumber = nextNumber.toString().padStart(9, "0");
    }

    const existingReceipt = await dbReceipts.findOne({ receiptNumber });

    if (!existingReceipt) {
      isUnique = true;
    }
  }

  return receiptNumber;
};

export default generateReceiptNumber;
