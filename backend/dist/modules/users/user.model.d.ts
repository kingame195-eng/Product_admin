import mongoose, { Document } from "mongoose";
export interface IUser extends Document {
    email: string;
    password: string;
    fullName: string;
    role: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, mongoose.DefaultSchemaOptions> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, IUser>;
//# sourceMappingURL=user.model.d.ts.map