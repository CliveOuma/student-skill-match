"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const profileController_1 = require("../controllers/profileController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Public Routes
router.get("/profiles", profileController_1.getProfiles);
router.get("/profiles/:id", profileController_1.getProfileById);
// Protected Routes
router.post("/profiles", authMiddleware_1.protect, profileController_1.createProfile);
router.put("/profiles/:id", authMiddleware_1.protect, profileController_1.updateProfile);
router.delete("/profiles/:id", authMiddleware_1.protect, profileController_1.deleteProfile);
exports.default = router;
