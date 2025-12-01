export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    // Chỉ gọi captureStackTrace nếu chạy trong Node.js
    const ErrorConstructor = Error as any;
    if (
      typeof ErrorConstructor.captureStackTrace === "function" &&
      typeof window === "undefined"
    ) {
      ErrorConstructor.captureStackTrace(this, this.constructor);
    }
  }
}
