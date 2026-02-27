import { prisma } from '../config/prisma'
import { Prisma, Workspace } from '@prisma/client'

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
        ownerId: userId
      },
      include: {
        projects: true
      },
      orderBy: { createdAt: "desc" }
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

}