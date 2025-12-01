import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validateRequest } from "../../middlewares/validation.middleware";
import { authMiddleware } from "../../middlewares/auth.middleware";
import Joi from "joi";

const router = Router();
const authController = new AuthController();

const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Email must be a valid email address",
      "any.required": "Email is required",
    }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required",
  }),
});

const registerSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Email must be a valid email address",
      "any.required": "Email is required",
    }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required",
  }),
  fullName: Joi.string().min(2).required().messages({
    "string.min": "Full name must be at least 2 characters",
    "any.required": "Full name is required",
  }),
});

router.post(
  "/register",
  validateRequest(registerSchema),
  authController.register
);

router.post("/login", validateRequest(loginSchema), authController.login);
router.post("/refresh", authController.refreshToken);
router.get("/me", authMiddleware, authController.getMe);

console.log("Auth routes loaded");

export default router;
