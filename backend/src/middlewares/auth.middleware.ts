import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/error.util";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authMiddleware = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
      console.log("[AUTH] No token provided");
      throw new AppError("Access token is required", 401);
    }

    console.log("[AUTH] Verifying token...");
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.user = decoded;
    console.log("[AUTH] Token verified for user:", decoded.email);
    next();
  } catch (error) {
    console.log("[AUTH] Error:", error);
    if (error instanceof jwt.TokenExpiredError) {
      next(new AppError("Token expired", 401));
    } else if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError("Invalid token", 401));
    } else {
      next(error);
    }
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    try {
      if (!req.user || !roles.includes(req.user.role)) {
        throw new AppError("Insufficient permissions", 403);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
