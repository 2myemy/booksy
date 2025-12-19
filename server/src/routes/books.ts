import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth";
import { upload } from "../middleware/upload";
import { createBook, listBooks, listMyBooks, getBookById } from "../controllers/booksController";

const router = Router();

router.get("/", listBooks);
router.get("/mine", requireAuth, listMyBooks);
router.get("/:id", getBookById); 
router.post("/", requireAuth, upload.single("cover"), createBook);

export default router;
