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

}