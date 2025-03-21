import { Request, Response } from "express";
import Profile, { IProfile } from "../models/profile.model";
import mongoose from "mongoose";

// Extend Express Request type to include 'user'
interface AuthRequest extends Request {
  user?: { id: string };
}


export const createProfile = async (req: Request, res: Response): Promise<void> => {
  console.log("🔍 Received Profile Creation Request:", req.body); 
  const { name, username, role, skills, portfolio, location, bio } = req.body;

  if (!name || !username || !role || !skills || !bio) {
    console.error("Missing required fields:", { name, username, role, skills, bio });
    res.status(400).json({ message: "All required fields must be provided" });
    return;
  }

  try {
    const existingProfile = await Profile.findOne({ username });
    if (existingProfile) {
      console.error("Username already exists:", username);
      res.status(400).json({ message: "Username already exists" });
      return;
    }

    const profile = await Profile.create({
      name,
      username,
      role,
      skills,
      portfolio,
      location,
      bio,
    });

    console.log("Profile Created Successfully:", profile);
    res.status(201).json(profile);
  } catch (error) {
    console.error("Profile Creation Error:", error);
    res.status(500).json({ message: "Failed to create profile" });
  }
};

export const getProfiles = async (req: Request, res: Response): Promise<void> => {
  try {
    const profiles = await Profile.find().sort({ createdAt: -1 });
    res.status(200).json(profiles);
  } catch (error) {
    console.error("Fetching Profiles Error:", error);
    res.status(500).json({ message: "Failed to fetch profiles" });
  }
};

export const getProfileById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid profile ID format" });
      return;
    }

    const profile = await Profile.findById(id);
    if (!profile) {
      res.status(404).json({ message: "Profile not found" });
      return;
    }

    res.json(profile);
  } catch (error) {
    console.error("Fetching Profile Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, username, role, skills, portfolio, location, bio } = req.body;
  const userId = req.user?.id; // Extracted from JWT Middleware

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid profile ID format" });
    return;
  }

  try {
    const profile = await Profile.findById(id) as IProfile | null;

    if (!profile) {
      res.status(404).json({ message: "Profile not found" });
      return;
    }

    // Ensure only the profile owner can edit
    if (profile._id.toString() !== userId) {
      res.status(403).json({ message: "You are not authorized to edit this profile" });
      return;
    }

    const updatedProfile = await Profile.findByIdAndUpdate(
      id,
      { name, username, role, skills, portfolio, location, bio },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedProfile);
  } catch (error) {
    console.error("Updating Profile Error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};


export const deleteProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user?.id; 

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid profile ID format" });
    return;
  }

  try {
    const profile = await Profile.findById(id) as IProfile | null;

    if (!profile) {
      res.status(404).json({ message: "Profile not found" });
      return;
    }


    if (profile._id.toString() !== userId) {
      res.status(403).json({ message: "You are not authorized to delete this profile" });
      return;
    }

    await Profile.findByIdAndDelete(id);
    res.status(200).json({ message: "Profile deleted successfully" });
  } catch (error) {
    console.error("Deleting Profile Error:", error);
    res.status(500).json({ message: "Failed to delete profile" });
  }
};
