import { Router } from "express";
import { ProjectController } from "../controllers/project.controller";
import { requireUser } from "../middlewares/auth.middleware";
import projectMemberRoutes from './project-member.route'

const router = Router({ mergeParams: true });

const projectController = new ProjectController();

router.get("/", requireUser, projectController.getProjects);
router.post("/", requireUser, projectController.createProject)
router.delete("/:projectId", requireUser, projectController.deleteProject)

router.use("/:projectId/members", projectMemberRoutes);

export default router