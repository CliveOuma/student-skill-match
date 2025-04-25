import mongoose, { Document, Schema, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  verificationToken?: string;
  verificationTokenExpires?: Date;
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
    isVerified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// TTL index: delete unverified users after 30 minutes
userSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 1800, // 30 minutes
    partialFilterExpression: { isVerified: false }, // Only unverified users will be deleted
  }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
