import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { ProjectRepo } from "../repositories/project.repository";
import { WorkspaceRepo } from "../repositories/workspace.repository";

export class ProjectController {

  private projectRepo = new ProjectRepo();
  private workspaceRepo = new WorkspaceRepo();

  public getProjects = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {

      const { workspaceId } = req.params;
      const userId = req.user!.userId;

      if (!workspaceId || workspaceId == undefined) {
        return res.status(400).json({
          message: "Workspace ID is required"
        })
      }

      const workspace = await this.workspaceRepo.getWorkspaceById(workspaceId as string);
      if (!workspace) {
        return res.status(403).json({
          message: "Workspace not found or wrong workspace id"
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

  public createProject = async (req: AuthRequest, res: Response) => {
    try {
      const { workspaceId } = req.params;
      const userId = req.user!.userId;
      const { name } = req.body;

      if (!name || name.trim() === '') {
        return res.status(400).json({ message: "Project name are required" });
      }

      const workspace = await this.workspaceRepo.getWorkspaceById(workspaceId as string);
      if (!workspace) {
        return res.status(404).json({
          message: "Workspace is missing or not exist"
        });
      }

      if (workspace.ownerId !== userId) {
        return res.status(403).json({
          message: "Require workspace owner role to create new project"
        })
      }

      const project = await this.projectRepo.createNewProject(
        workspaceId as string,
        userId as string,
        name as string
      )

      return res.status(201).json({
        message: "Project created successfully",
        data: { project }
      })

    } catch (error) {
      return res.status(500).json({
        message: "Internal server error"
      })
    }
  }

  public deleteProject = async (req: AuthRequest, res: Response) => {
    try {

      const { workspaceId, projectId } = req.params;
      const userId = req.user!.userId;

      if (!workspaceId || !projectId) {
        return res.status(400).json({message: "Workspace id and Project id are required"});
      }

      const deletedProject = await this.projectRepo.deleteProjectById(
        workspaceId as string,
        userId as string,
        projectId as string
      );

      if(deletedProject.count === 0) {
        return res.status(404/403).json({
          message: "Project not found or permission required"
        })
      }

      return res.status(200).json({
        message: "Project deleted successfully"
      })
    } catch (error) {
      console.log("Delete project error", error);
      return res.status(500).json("Internal server error");
    }
  }
}