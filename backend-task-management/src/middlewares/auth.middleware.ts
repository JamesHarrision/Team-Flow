import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
  user?: {
    userId: string,
    role: string
  }
}

// Chỉ đọc X-User-Id từ Header, hoàn toàn tin tưởng Gateway
export const requireUser = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const userId = req.headers['x-user-id'] as string;
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized: Missing User ID from Gateway' });
    return;
  }
  req.user = { userId, role: 'MEMBER' }; // Tạm thời mock role
  next();
};