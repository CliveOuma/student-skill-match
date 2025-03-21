import express from "express";
import { 
  createTeam, 
  getTeams, 
  getTeamById, 
  updateTeam, 
  deleteTeam 
} from "../controllers/teamController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/teams", getTeams);
router.post("/teams", protect, createTeam);
router.put("/teams/:id", protect, updateTeam);
router.delete("/teams/:id", protect, deleteTeam);
router.get("/teams/:id", getTeamById);

export default router;
