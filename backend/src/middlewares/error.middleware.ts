import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/error.util";

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error("[ERROR HANDLER]", err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
  }

  // Custom validation error from Joi
  if (err.name === "ValidationError" && (err as any).details) {
    return res.status(400).json({
      success: false,
      message: err.message,
      errors: (err as any).details,
    });
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: err.message,
    });
  }

  // Mongoose duplicate key error
  if (err.name === "MongoServerError" && (err as any).code === 11000) {
    return res.status(400).json({
      success: false,
      message: "Duplicate field value entered",
    });
  }

  // Default error
  console.error("ERROR 💥", err);
  return res.status(500).json({
    success: false,
    message: "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
