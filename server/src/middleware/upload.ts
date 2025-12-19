import multer from "multer";
import cloudinary from "../lib/cloudinary";

// 1️⃣ multer 설정 (메모리 저장)
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image files are allowed"));
      return;
    }
    cb(null, true);
  },
});

// 2️⃣ Cloudinary 업로드 헬퍼
export const uploadBufferToCloudinary = async (
  file: Express.Multer.File,
  folder = "booksy"
): Promise<string> => {
  const base64 = file.buffer.toString("base64");
  const dataUri = `data:${file.mimetype};base64,${base64}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: "image",
  });

  return result.secure_url;
};
