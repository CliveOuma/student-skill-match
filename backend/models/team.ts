import mongoose, { Schema, Document } from "mongoose";

export interface ITeam extends Document {
  name: string;
  groupLeaderPhone: string; 
  category: "Web Development" | "Data Science" | "AI & ML" | "Cybersecurity" | "Blockchain";
  teamType: "Hackathon Team" | "Startup Team" | "Research Group" | "Freelance Team";
  skills: string[];
  teamSize: number;
  description?: string;
  createdBy: mongoose.Types.ObjectId; 
  createdAt: Date;
}

const TeamSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    groupLeaderPhone: { type: String, required: true },
    category: { type: String, required: true, enum: ["Web Development", "Data Science", "AI & ML", "Cybersecurity", "Blockchain"] },
    teamType: { type: String, required: true, enum: ["Hackathon Team", "Startup Team", "Research Group", "Freelance Team"] },
    skills: { type: [String], required: true },
    teamSize: { type: Number, required: true, min: 1 },
    description: { type: String, trim: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Team = mongoose.model<ITeam>("Team", TeamSchema);

export default Team;
