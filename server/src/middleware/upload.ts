import multer from "multer";
import cloudinary from "../lib/cloudinary";

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
