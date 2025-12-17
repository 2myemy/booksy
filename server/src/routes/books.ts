import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth";
import { upload } from "../middleware/upload";
import { createBook, listBooks, listMyBooks } from "../controllers/booksController";

const router = Router();

router.get("/", listBooks);
router.post("/", requireAuth, upload.single("cover"), createBook);
router.get("/mine", requireAuth, listMyBooks);

export default router;
