import mongoose, { Document, Schema, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  verificationCode?: string;
  verificationCodeExpires?: Date;
  isVerified: boolean;
  createdAt: Date; 
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verificationToken: { type: String },
    verificationTokenExpires: { type: Date },
    verificationCode: { type: String },
    verificationCodeExpires: { type: Date },
    isVerified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
