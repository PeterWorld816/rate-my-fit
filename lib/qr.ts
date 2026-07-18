import QRCode from "qrcode";

export async function generateQrDataUrl(text: string, size = 220): Promise<string | null> {
  try {
    return await QRCode.toDataURL(text, {
      width: size,
      margin: 1,
      color: { dark: "#0a0a0f", light: "#ffffff" },
    });
  } catch {
    return null;
  }
}
