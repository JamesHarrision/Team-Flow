import { Router } from "express"
import { ProjectMemberController } from "../controllers/project-member.controller";
import { requireUser } from "../middlewares/auth.middleware";

const router = Router({mergeParams: true});
const projectMemberController = new ProjectMemberController();

router.get("/", requireUser, projectMemberController.getProjectMembers);

export default router;