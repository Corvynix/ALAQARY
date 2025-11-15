import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { storage } from "../storage";
import type { User } from "@shared/schema";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET || JWT_SECRET === "your-secret-key-change-in-production") {
  throw new Error("JWT_SECRET environment variable must be set to a strong secret value");
}

export interface AuthRequest extends Request {
  user?: User;
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authReq = req as AuthRequest;
  const token = authReq.cookies?.token;

  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET!) as { userId: string; role: string };
    storage.getUser(decoded.userId).then(user => {
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
      if (user.role !== decoded.role) {
        return res.status(401).json({ error: "Token role mismatch" });
      }
      authReq.user = user;
      next();
    }).catch(() => {
      res.status(401).json({ error: "Authentication failed" });
    });
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}

export function requireRole(role: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      return res.status(401).json({ error: "Authentication required" });
    }
    if (authReq.user.role !== role) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
  };
}

export function generateToken(userId: string, role: string): string {
  return jwt.sign({ userId, role }, JWT_SECRET!, { expiresIn: "7d" });
}
