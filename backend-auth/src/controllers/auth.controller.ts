import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { error } from 'node:console';

export class AuthController {
  private authService = new AuthService();

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({
          error: "Email and password are required"
        })
        return;
      }

      const tokens = await this.authService.register(email, password);
      res.status(201).json({
        message: "User registered successfully",
        tokens
      })
    } catch (error: any) {
      if (error.code === 'P2002') {
        res.status(409).json({ error: "Email already exists" });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const tokens = await this.authService.login(email, password);
      res.status(200).json({
        message: "Login successfully",
        tokens
      })
    } catch (error: any) {
      if (error.message === "INVALID_CREDENTIALS") {
        res.status(400).json({ error: "Invalid email or password" });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const { refreshToken } = req.body;

      const tokens = await this.authService.refresh(refreshToken)

      res.status(200).json({
        message: "Refresh token successfully",
        tokens
      })
    } catch (error) {
      res.status(401).json({message: error});
    }
  }
}