import { prisma } from '../config/prisma'
import { RefreshToken, Prisma } from '@prisma/client'

export class RefreshTokenRepository {
  async createRefreshToken(userId: string, token: string, expiresAt: Date): Promise<RefreshToken> {

    return await prisma.refreshToken.create({
      data: {
        token: token,
        expires_at: expiresAt,
        userId: userId,
      }
    });
  }

  async revokeToken(token: string): Promise<RefreshToken | null> {
    return await prisma.refreshToken.update({
      where: {
        token: token
      }, 
      data: {
        is_revoked: true
      }
    });
  }
}