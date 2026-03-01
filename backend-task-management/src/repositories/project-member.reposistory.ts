import { Prisma, ProjectRole } from "@prisma/client";
import { prisma } from "../config/prisma";

export class ProjectMemberReposistory {

  public getProjectMembers = async (
    workspaceId: string,
    projectId: string,
    requestingUser: string
  ) => {

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
        workspaceId: workspaceId,
        OR: [
          { workspace: { ownerId: requestingUser } },
          {
            members: {
              some: {
                userId: requestingUser,
              }
            }
          }
        ]
      },
      select: {
        id: true,
        name: true,
        members: {
          select: {
            userId: true,
            role: true
          }
        }
      }
    })
    return project;
  }

  public inviteNewUser = async (
    workspaceId: string,
    projectId: string,
    userId: string,
    newUserId: string
  ) => {
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
        workspaceId: workspaceId,
        OR: [
          { workspace: { ownerId: userId } },
          {
            members: {
              some: {
                userId: userId,
                role: { in: [ProjectRole.OWNER, ProjectRole.PM] }
              }
            }
          }
        ]
      }
    })

    if (!project) return null;

    return await prisma.projectMember.create({
      data: {
        projectId: projectId,
        userId: newUserId,
        role: ProjectRole.MEMBER
      }
    })
  }

  public updateRoleForUserById = async (
    workspaceId: string,
    projectId: string,
    idToChange: string,
    roleToChange: ProjectRole,
    userId: string,
  ) => {

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        workspaceId: workspaceId,
        OR: [
          { workspace: { ownerId: userId } },
          {
            members: {
              some: {
                userId: userId,
                role: ProjectRole.OWNER
              }
            }
          }
        ]
      },
      select: {
        workspace: true
      }
    })

    if (!project) throw new Error("FORBIDDEN");

    //Project owner ko được tự hạ quyền (ko phải workspace owner)
    const isWorkspaceOwner = project.workspace.ownerId === userId;
    if (!isWorkspaceOwner && idToChange === userId && roleToChange !== "OWNER") {
      throw new Error("CANNOT_DOWNGRADE_SELF");
    }

    return await prisma.projectMember.updateMany({
      where: {
        projectId: projectId,
        userId: idToChange
      },
      data: {
        role: roleToChange
      }
    })
  }
}