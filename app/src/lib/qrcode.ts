import QRCode from "qrcode";

export async function generateQrPng(url: string): Promise<Buffer> {
  return QRCode.toBuffer(url, {
    type: "png",
    margin: 2,
    width: 512,
    errorCorrectionLevel: "M",
  });
}
