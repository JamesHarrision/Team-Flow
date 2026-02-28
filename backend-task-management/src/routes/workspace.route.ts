import { Router } from "express";
import { WorkspaceController } from "../controllers/workspace.controller";
import { requireUser } from "../middlewares/auth.middleware";
import projectRouter from "./project.route";

const router = Router();
const workspaceController = new WorkspaceController();

router.post("/", requireUser, workspaceController.createWorkSpace)
router.get("/", requireUser, workspaceController.getWorkspaces)
router.get("/:id", requireUser, workspaceController.getWorkspaceById)
router.put("/:id", requireUser, workspaceController.updateWorkspaceById)
router.delete("/:id", requireUser, workspaceController.deleteWorkspaceById)

//Project route: 
router.use("/:workspaceId/projects", projectRouter)

export default router;