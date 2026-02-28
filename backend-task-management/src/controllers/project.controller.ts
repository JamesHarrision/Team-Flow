import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { ProjectRepo } from "../repositories/project.repository";

export class ProjectController {

  private projectRepo = new ProjectRepo();

  public getProjects = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {

      const { workspaceId } = req.params;
      const userId = req.user!.userId;

      if (!workspaceId) {
        return res.status(400).json({
          message: "Workspace ID is required"
        })
      }

      const projects = await this.projectRepo.getAccessibleProjects(workspaceId as string, userId);

      return res.status(200).json({
        message: "Projects retrieved successfully",
        data: {
          projects
        }
      })
    } catch (error) {
      console.error('[ProjectController.getProjects] Error:', error);
      return res.status(500).json({
        message: "Internal server error"
      })
    }
  }

}