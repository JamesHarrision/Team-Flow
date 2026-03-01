import { Router } from "express"
import { ProjectMemberController } from "../controllers/project-member.controller";
import { requireUser } from "../middlewares/auth.middleware";

const router = Router({mergeParams: true});
const projectMemberController = new ProjectMemberController();

router.get("/", requireUser, projectMemberController.getProjectMembers);
router.post("/", requireUser, projectMemberController.inviteNewUser);

export default router;