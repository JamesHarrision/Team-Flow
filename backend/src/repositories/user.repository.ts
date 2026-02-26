import { prisma } from '../config/prisma'
import { Prisma, User } from '@prisma/client'

export class UserRepository {
  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return await prisma.user.create({ data });
  }
  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: {
        email: email
      }
    })
  }
}
