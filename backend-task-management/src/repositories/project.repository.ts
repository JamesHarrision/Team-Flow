import { Prisma, ProjectRole } from '@prisma/client';
import { prisma } from '../config/prisma'

export class ProjectRepo {

  public getAccessibleProjects = async (workspaceId: string, userId: string) => {
    // Chỉ lấy những project mà user có quyền truy cập:
    // 1. User là Owner của Workspace
    // 2. HOẶC User là thành viên (ProjectMember) của chính Project đó
    return await prisma.project.findMany({
      where: {
        workspaceId: workspaceId,
        OR: [
          { workspace: { ownerId: userId } },
          { members: { some: { id: userId } } }
        ]
      },
      include: {
        // Trả về kèm role của chính user đó trong project để FE tiện xử lý UI
        members: {
          where: { userId: userId },
          select: { role: true }
        },
        _count: {
          select: {
            sections: true,
            members: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    })
  }

  public createNewProject = async (
    workspaceId: string,
    userId: string,
    name: string,
  ) => {
    return await prisma.$transaction(async (tx) => {
      // Bước 1: Tạo Project
      const project = await tx.project.create({
        data: {
          name: name,
          workspaceId: workspaceId
        }
      });

      // Bước 2: Tạo Member (role OWNER)
      await tx.projectMember.create({
        data: {
          projectId: project.id,
          userId: userId,
          role: ProjectRole.OWNER
        }
      });

      return await tx.project.findUnique({
        where: { id: project.id },
        include: { members: true }
      })
    });
  }

}