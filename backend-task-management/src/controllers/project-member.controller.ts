import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { ProjectMemberReposistory } from "../repositories/project-member.reposistory";
import { stringify } from "node:querystring";
import { ProjectRole } from "@prisma/client";

export class ProjectMemberController {

  private projectMemberRepo = new ProjectMemberReposistory();

  public getProjectMembers = async (
    req: AuthRequest,
    res: Response
  ): Promise<Response> => {

    const { workspaceId, projectId } = req.params;
    const userId = req.user!.userId;

    try {

      const projectMembers = await this.projectMemberRepo.getProjectMembers(
        workspaceId as string,
        projectId as string,
        userId as string
      );

      if (!projectMembers) {
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

  public inviteNewUser = async (
    req: AuthRequest,
    res: Response,
  ): Promise<Response> => {

    const { projectId, workspaceId } = req.params;
    const userId = req.user!.userId;
    const { newUserId } = req.body;

    if (!newUserId) {
      return res.status(400).json({
        message: "New user id is required to invite"
      })
    }

    try {
      const newUser = await this.projectMemberRepo.inviteNewUser(
        workspaceId as string,
        projectId as string,
        userId as string,
        newUserId as string
      );

      if (!newUser) {
        return res.status(403).json({
          message: "Project not found or required permission to invite"
        })
      }

      return res.status(201).json({
        message: "Add user to project successfully",
        data: {
          newUser
        }
      })
    } catch (error: any) {
      if (error.code === 'P2002') {
        return res.status(400).json({
          message: "User already member of project"
        })
      } else {
        console.log("invite user error", error);
        return res.status(500).json({
          message: "Internal server error"
        })
      }
    }
  }

  public changeRoleForUserById = async (
    req: AuthRequest,
    res: Response
  ): Promise<Response> => {


    const { workspaceId, projectId, userId } = req.params;
    const requestingUserId = req.user!.userId;
    const { newRole } = req.body;

    const VALID_ROLE = ["OWNER", "PM", "MEMBER", "VIEWER"];
    if (!VALID_ROLE.includes(newRole)) {
      return res.status(400).json({
        message: "Invalid role or missing new role"
      })
    }

    try {
      const updatedUserRole = await this.projectMemberRepo.updateRoleForUserById(
        workspaceId as string,
        projectId as string,
        userId as string,
        newRole as ProjectRole,
        requestingUserId as string
      )

      // console.log(userId);
      // console.log(updatedUserRole);

      return res.status(200).json({
        message: "Update role successfully"
      })

    } catch (error: any) {
      if (error.message === "FORBIDDEN") {
        return res.status(403).json({ message: "Forbidden: You need permission for this operation" });
      }
      if (error.message === "CANNOT_DOWNGRADE_SELF") {
        return res.status(400).json({ message: "Bad Request: Project Owner cannot downgrade their own role" });
      }
      if (error.code === 'P2025') {
        return res.status(404).json({ message: "Target user is not a member of this project" });
      }
      console.error("[changeRoleForUserById] Error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }

  }
}