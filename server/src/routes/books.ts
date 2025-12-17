import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth";
import { upload } from "../middleware/upload";
import { createBook } from "../controllers/booksController";

const router = Router();

router.post("/", requireAuth, upload.single("cover"), createBook);

export default router;
