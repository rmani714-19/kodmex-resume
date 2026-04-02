import { Router } from "express";
import { githubProjects } from "../controllers/githubController.js";

const router = Router();

router.get("/", githubProjects);

export default router;
