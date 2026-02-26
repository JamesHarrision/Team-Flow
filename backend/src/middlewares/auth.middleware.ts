import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
  user?: {
    userId: string,
    role: string
  }
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1] || req.cookies?.accessToken;

  if (!token) {
    res.status(401).json({ message: "Access token is missing" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;

    req.user = {
      userId: decoded.userId,
      role: decoded.role
    }

    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired access token' });
  }
}

export const checkRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    // TODO: Người học tự gõ lại logic ở đây
    // Gợi ý: Kiểm tra req.user xem có tồn tại không và role có khớp không.

    const user = req.user;

    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    if (!user.role || !allowedRoles.includes(user.role)) {
      res.status(403).json({ message: "Unauthorized User" });
      return;
    }

    next();
  };
};