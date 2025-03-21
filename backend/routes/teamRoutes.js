"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const teamController_1 = require("../controllers/teamController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get("/teams", teamController_1.getTeams);
router.post("/teams", authMiddleware_1.protect, teamController_1.createTeam);
router.put("/teams/:id", authMiddleware_1.protect, teamController_1.updateTeam);
router.delete("/teams/:id", authMiddleware_1.protect, teamController_1.deleteTeam);
router.get("/teams/:id", teamController_1.getTeamById);
exports.default = router;
