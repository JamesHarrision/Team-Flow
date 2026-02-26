import jwt, { JsonWebTokenError, JwtPayload } from 'jsonwebtoken'
import { UserRepository } from '../repositories/user.repository'
import { RefreshTokenRepository } from '../repositories/refresh-token.repository'
import { comparePassword, hashPassword } from '../utils/bcrypt';
import dotenv from 'dotenv'

export class AuthService {
  private userRepo = new UserRepository();
  private tokenRepo = new RefreshTokenRepository();

  async register(email: string, password_raw: string) {
    // 1. Băm mật khẩu
    const password_hash = await hashPassword(password_raw);
    // 2. Lưu user vào DB
    // Lưu ý: Nếu email trùng, Prisma ném lỗi P2002. Controller sẽ bắt lỗi này.
    const user = await this.userRepo.createUser({ email, password_hash });

    // 3. Cấp phát cặp Token
    return this.generateTokens(user.id);
  }

  async login(email: string, password_raw: string) {
    // 1. Tìm User
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new Error("INVALID_CREDENTIALS");
    }

    // 2. So sánh mật khẩu
    const isMatch = await comparePassword(password_raw, user.password_hash);
    if (!isMatch) {
      throw new Error("INVALID_CREDENTIALS");
    }

    // 3. Cấp phát Token mới
    return this.generateTokens(user.id);
  }

  async generateTokens(userId: string) {
    // Ký Access Token (sống 15 phút)
    const accessToken = jwt.sign(
      { data: userId },
      process.env.JWT_SECRET as string,
      { expiresIn: '15m' }
    )

    // Ký Refresh Token (sống 7 ngày)
    const refreshToken = jwt.sign(
      { data: userId },
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: "7d" }
    )

    // Lưu Refresh Token vào Database để quản lý phiên đăng nhập
    let expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await this.tokenRepo.createRefreshToken(userId, refreshToken, expiresAt);

    return { accessToken, refreshToken };
  }

  async refresh(token: string) {
    try {
      const decoded: JwtPayload
        = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as JwtPayload;

      const storedToken = await this.tokenRepo.findByToken(token);

      if (!storedToken) throw new Error('Refresh token not found');
      if (storedToken.is_revoked) throw new Error('Refresh token is revoked');
      if (storedToken.expires_at < new Date()) throw new Error("Refresh token is expired");

      await this.tokenRepo.revokeToken(token);

      return this.generateTokens(decoded.data);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
