import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { ProjectMemberReposistory } from "../repositories/project-member.reposistory";
import { stringify } from "node:querystring";

export class ProjectMemberController {

  private projectMemberRepo = new ProjectMemberReposistory();

  public getProjectMembers = async (
    req: AuthRequest,
    res: Response
  ): Promise<Response> => {

    const {workspaceId, projectId} = req.params;
    const userId = req.user!.userId;

    try {

      const projectMembers = await this.projectMemberRepo.getProjectMembers(
        workspaceId as string,
        projectId as string,
        userId as string
      );

      if(!projectMembers){
        return res.status(403).json({
          message: "Forbidden: You do not have access to this project or project not found"
        })
      }

      return res.status(200).json({
        message: "Get member list successfully",
        data: {
          projectMembers
        }
      })

    } catch (error) {
      console.log("Get member list error", error);
      return res.status(500).json({
        message: "Internal server error"
      })
    }
  }

}