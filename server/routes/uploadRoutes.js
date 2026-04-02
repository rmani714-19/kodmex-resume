import { Router } from "express";
import multer from "multer";
import { parseUpload } from "../controllers/uploadController.js";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

router.post("/", upload.single("resume"), parseUpload);

export default router;
