import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  fullName: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// User Schema
const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false }, // Bảo mật hơn
    fullName: { type: String, required: true },
    role: { type: String, enum: ["admin", "manager", "staff"], default: "admin" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);

