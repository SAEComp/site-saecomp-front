import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
  id: number;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    // If no token, continue without user info (anonymous)
    return next();
  }

  try {
    const secret = process.env.JWT_SECRET || 'saecomp_lojinha_secret_key_2025';
    const decoded = jwt.verify(token, secret) as UserPayload;
    req.user = decoded;
  } catch (error) {
    console.error('Error verifying token:', error);
    // Continue without user info if token is invalid
  }

  next();
};

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Token de acesso requerido'
    });
  }
  next();
};
