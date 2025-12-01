import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../users/user.model";
import { AppError } from "../../utils/error.util";

interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

export class AuthService {
  async register(data: { email: string; password: string; fullName: string }) {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new AppError("Email already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);
    const user = await User.create({
      ...data,
      password: hashedPassword,
    });

    const tokens = this.generateTokens({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return { user, tokens };
  }

  async login(email: string, password: string) {
    try {
      console.log("[AuthService.login] Starting login for:", email);

      // Find user and explicitly include password
      let user = await User.findOne({ email }).select("+password");
      console.log("[AuthService.login] User found:", user ? "yes" : "no");

      if (!user) {
        throw new AppError("Invalid credentials", 401);
      }

      if (!user.isActive) {
        throw new AppError("User account is inactive", 401);
      }

      console.log("[AuthService.login] Comparing passwords...");
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log("[AuthService.login] Password valid:", isPasswordValid);

      if (!isPasswordValid) {
        throw new AppError("Invalid credentials", 401);
      }

      // Convert to object and remove password
      const userObj = user.toObject();
      delete (userObj as any).password;

      const tokens = this.generateTokens({
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      });

      return { user: userObj, ...tokens };
    } catch (error) {
      console.error("[AuthService.login] Error:", error);
      throw error;
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET!
      ) as TokenPayload;

      const user = await User.findById(decoded.id);
      if (!user || !user.isActive) {
        throw new AppError("Invalid refresh token", 401);
      }

      return this.generateTokens({
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      });
    } catch (error) {
      throw new AppError("Invalid refresh token", 401);
    }
  }

  async getUserById(userId: string) {
    const user = await User.findById(userId).select("-password");
    if (!user || !user.isActive) {
      throw new AppError("User not found", 404);
    }
    return user;
  }

  private generateTokens(payload: TokenPayload) {
    const accessToken = (jwt as any).sign(
      payload,
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRES_IN as string }
    );

    const refreshToken = (jwt as any).sign(
      payload,
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN as string }
    );

    return { accessToken, refreshToken };
  }
}
