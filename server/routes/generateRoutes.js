import { Router } from "express";
import { generateResume } from "../controllers/generateController.js";

const router = Router();

router.post("/", generateResume);

export default router;
