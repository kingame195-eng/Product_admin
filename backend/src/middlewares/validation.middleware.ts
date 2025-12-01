import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { AppError } from "../utils/error.util";

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const { error, value } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        const messages = error.details
          .map((detail) => detail.message)
          .join(", ");
        throw new AppError(messages, 400);
      }

      req.body = value;
      next();
    } catch (error) {
      next(error);
    }
  };
};
