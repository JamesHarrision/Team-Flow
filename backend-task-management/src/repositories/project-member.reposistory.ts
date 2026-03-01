import { ProjectRole } from "@prisma/client";
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
}