import { Request, Response } from "express";
import { WorkspaceRepo } from "../repositories/workspace.repository";
import { AuthRequest } from "../middlewares/auth.middleware";
import { prisma } from "../config/prisma";

export class WorkspaceController {
  private workspaceRepo = new WorkspaceRepo();

  public createWorkSpace = async (req: AuthRequest, res: Response) => {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Name are required"
      })
    }
    const userId = req.user!.userId;

    try {
      const workspace = await this.workspaceRepo.createWorkspace(
        {
          name,
          description,
          ownerId: userId
        }
      )

      return res.status(201).json({
        message: "Workspace created successfully",
        data: {
          workspace
        }
      })
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error"
      })
    }
  }

  public getWorkspaces = async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;
    try {
      const workspaces = await this.workspaceRepo.getWorkspacesByUserId(userId);
      return res.status(200).json({
        message: "Workspaces retrieved successfully",
        data: {
          workspaces
        }
      })
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error"
      })
    }

  }

  public getWorkspaceById = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    try {
      const workspace = await this.workspaceRepo.getWorkspaceById(id as string);

      if (!workspace) {
        return res.status(404).json({
          message: "Workspace not found"
        })
      }

      if(req.user && workspace.ownerId !== req.user.userId){
        return res.status(403).json({
          message: "Forbidden: You do not have access to this workspace"
        })
      }

      return res.status(200).json({
        message: `Get workspace ${id} successfully`,
        data: {
          workspace
        }
      })
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error"
      })
    }
  }

}