import { Router } from "express";
import { ProjectController } from "../controllers/project.controller";
import { requireUser } from "../middlewares/auth.middleware";

const router = Router();

const projectController = new ProjectController();

router.get("/", requireUser, projectController.getProjects);
router.post("/", requireUser, projectController.createProject)

export default router