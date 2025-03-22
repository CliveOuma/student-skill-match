import mongoose, { Schema, Document } from "mongoose";

export interface IProfile extends Document {
  _id: mongoose.Types.ObjectId; 
  name: string;
  username: string;
  role: string;
  skills: string[];
  phone: Number;
  portfolio?: string;
  location?: string;
  bio: string;
}

const ProfileSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    role: { type: String, required: true, trim: true },
    skills: { type: [String], required: true },
    phone: { type: Number, required: true },
    portfolio: { type: String, trim: true },
    location: { type: String, trim: true },
    bio: { type: String, required: true, trim: true },
  },
  {
    timestamps: true, 
  }
);

const Profile = mongoose.model<IProfile>("Profile", ProfileSchema);

export default Profile;
