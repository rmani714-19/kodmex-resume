import { Router } from "express";
import { scoreAts } from "../controllers/atsController.js";

const router = Router();

router.post("/", scoreAts);

export default router;
