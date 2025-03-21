import { Request, Response } from "express";
import Team, { ITeam } from "../models/team.model";
import mongoose from "mongoose";

// Extend Express Request type to include 'user'
interface AuthRequest extends Request {
  user?: { id: string };
}


export const createTeam = async (req: AuthRequest, res: Response): Promise<void> => {
  console.log("🔍 Incoming Request Body:", req.body);

  const { name, category, role, teamType, skills, teamSize, description } = req.body;
  const userId = req.user?.id; // Extracted from JWT Middleware

  if (!name || !category || !role || !teamType || !skills || !teamSize) {
    res.status(400).json({ message: "All required fields must be provided" });
    return;
  }

  try {
    const team = await Team.create({
      name,
      category,
      role,
      teamType,
      skills,
      teamSize,
      description,
      createdBy: new mongoose.Types.ObjectId(userId), // Ensure ObjectId conversion
    });

    res.status(201).json(team);
  } catch (error) {
    console.error("Team Creation Error:", error);
    res.status(500).json({ message: "Failed to create team" });
  }
};

export const getTeams = async (req: Request, res: Response): Promise<void> => {
  try {
    const teams = await Team.find().populate("createdBy", "name email").sort({ createdAt: -1 });
    res.status(200).json(teams);
  } catch (error) {
    console.error("Fetching Teams Error:", error);
    res.status(500).json({ message: "Failed to fetch teams" });
  }
};

export const getTeamById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid team ID format" });
      return;
    }

    const team = await Team.findById(id).populate("createdBy", "name email") as ITeam | null;
    if (!team) {
      res.status(404).json({ message: "Team not found" });
      return;
    }

    res.json(team);
  } catch (error) {
    console.error("Fetching Team Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateTeam = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, category, role, teamType, skills, teamSize, description } = req.body;
  const userId = req.user?.id; // Extracted from JWT Middleware

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid team ID format" });
    return;
  }

  try {
    const team = await Team.findById(id) as ITeam | null;

    if (!team) {
      res.status(404).json({ message: "Team not found" });
      return;
    }

    if (team.createdBy.toString() !== userId) {
      res.status(403).json({ message: "You are not authorized to edit this team" });
      return;
    }

    const updatedTeam = await Team.findByIdAndUpdate(
      id,
      { name, category, role, teamType, skills, teamSize, description },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedTeam);
  } catch (error) {
    console.error("Updating Team Error:", error);
    res.status(500).json({ message: "Failed to update team" });
  }
};

export const deleteTeam = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user?.id; // Extracted from JWT Middleware

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid team ID format" });
    return;
  }

  try {
    const team = await Team.findById(id) as ITeam | null;

    if (!team) {
      res.status(404).json({ message: "Team not found" });
      return;
    }

    if (team.createdBy.toString() !== userId) {
      res.status(403).json({ message: "You are not authorized to delete this team" });
      return;
    }

    await Team.findByIdAndDelete(id);
    res.status(200).json({ message: "Team deleted successfully" });
  } catch (error) {
    console.error("Deleting Team Error:", error);
    res.status(500).json({ message: "Failed to delete team" });
  }
};
