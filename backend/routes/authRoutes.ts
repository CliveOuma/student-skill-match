import express from "express";
import { register, login, verifyEmail, resendVerificationEmail, checkVerificationStatus } from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification-email", resendVerificationEmail);
router.get("/check-verification-status", checkVerificationStatus);


export default router;
