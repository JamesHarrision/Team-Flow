import { prisma } from '../config/prisma'
import { Prisma, Workspace } from '@prisma/client'
import { Project, ProjectMember } from '@prisma/client'

export class WorkspaceRepo {

  public createWorkspace = async (
    data: Prisma.WorkspaceCreateInput
  ): Promise<Workspace> => {
    return await prisma.workspace.create({
      data
    })
  }

  public getWorkspacesByUserId = async (userId: string) => {
    return await prisma.workspace.findMany({
      where: {
        OR: [
          {
            ownerId: userId
          },
          {
            projects: {
              some: {
                members: {
                  some: {
                    userId: userId
                  }
                }
              }
            }
          }
        ]
      },
      select: {
        id: true,
        name: true,
        description: true,
        ownerId: true,
        createdAt: true,
        updatedAt: true,
        projects: true
      },
      orderBy: {
        createdAt: "desc"
      }
    })
  }

  public getWorkspaceById = async (id: string) => {
    return await prisma.workspace.findUnique({
      where: { id },
      include: {
        projects: true
      },
    })
  }

  public updateWorkspaceById = async (
    id: string,
    data: Prisma.WorkspaceUpdateInput
  ) => {
    return await prisma.workspace.update({
      where: {
        id: id
      },
      data
    })
  }

  public deleteWorkspaceById = async (id: string) => {
    return prisma.workspace.delete({
      where: { id }
    })
  }
}