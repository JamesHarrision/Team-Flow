import { Router } from "express";
import { WorkspaceController } from "../controllers/workspace.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();
const workspaceController = new WorkspaceController();

router.post("/", verifyToken ,workspaceController.createWorkSpace)


export default router;