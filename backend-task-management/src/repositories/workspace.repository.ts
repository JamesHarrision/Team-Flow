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

}