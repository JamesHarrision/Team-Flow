import { Request, Response } from "express";
import { WorkspaceRepo } from "../repositories/workspace.repository";
import { AuthRequest } from "../middlewares/auth.middleware";

export class WorkspaceController {
  private workspaceRepo = new WorkspaceRepo();

  public createWorkSpace = async (req: AuthRequest, res: Response) => {
    const { name, description } = req.body;

    if(!name || !description) {
      return res.status(400).json({
        message: "Name and description are required"
      })
    }

    const user = req?.user || undefined;

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized"
      })
    }

    try {
      const workspace = await this.workspaceRepo.createWorkspace(
        {
          name,
          description,
          ownerId: user.userId
        }
      )

      return res.status(201).json({
        message: "Workspace created successfully",
        data: {
          workspace
        }
      })
    } catch (error) {
      return res.status(501).json({
        message: "Internal server error"
      })
    }
  }
}