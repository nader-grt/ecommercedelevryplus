import { fileTypeFromBuffer } from "file-type";
import sharp from "sharp";
import crypto from "crypto";

export class ImageValidator {

  static ALLOWED_MIME = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  static MAX_SIZE = 2 * 1024 * 1024;

  static async validate(file: Express.Multer.File) {

    if (!file.buffer) {
      throw new Error("File buffer missing");
    }

    // real mimetype from bytes
    const type = await fileTypeFromBuffer(file.buffer);
    if (!type || !this.ALLOWED_MIME.includes(type.mime)) {
      throw new Error("Invalid image type");
    }

    // size
    if (file.size > this.MAX_SIZE) {
      throw new Error("File too large");
    }

    //  image metadata
    const meta = await sharp(file.buffer).metadata();
    if (!meta.width || !meta.height) {
      throw new Error("Invalid image");
    }

    // hash
    const hash = crypto
      .createHash("sha256")
      .update(file.buffer)
      .digest("hex");

    return {
      mime: type.mime,
      width: meta.width,
      height: meta.height,
      hash,
    };
  }
}
