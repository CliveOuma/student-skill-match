import express from "express";
import {
  createProfile,
  getProfiles,
  getProfileById,
  updateProfile,
  deleteProfile
} from "../controllers/profileController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// Public Routes
router.get("/profiles", getProfiles); 
router.get("/profiles/:id", getProfileById);

// Protected Routes
router.post("/profiles", protect, createProfile); 
router.put("/profiles/:id", protect, updateProfile); 
router.delete("/profiles/:id", protect, deleteProfile); 
export default router;
