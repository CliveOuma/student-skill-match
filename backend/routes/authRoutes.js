"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post("/register", auth_controller_1.register);
router.post("/login", auth_controller_1.login);
router.post("/logout", auth_controller_1.logout);
router.get("/me", authMiddleware_1.protect, auth_controller_1.getMe);
exports.default = router;
