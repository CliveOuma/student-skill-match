import { Request, Response } from "express";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { hashPassword } from "../utils/hash";
import { sendVerificationEmail } from "../utils/sendEmail";

export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Email already exists" });
      return;
    }

    const hashedPassword = await hashPassword(password);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    const codeExpires = new Date(Date.now() + 60 * 1000); // 60 seconds (1 minute)

    await User.create({
      name,
      email,
      password: hashedPassword,
      verificationCode,
      verificationCodeExpires: codeExpires,
      isVerified: false,
    });

    await sendVerificationEmail(email, verificationCode);
    res.status(201).json({ message: "User registered. Verification code sent." });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const resendVerificationEmail = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  if (!email) {
   res.status(400).json({ message: "Email is required" });
   return;
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (user.isVerified) {
       res.status(400).json({ message: "Email already verified" });
       return;
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    const codeExpires = new Date(Date.now() + 60 * 1000); // 60 seconds (1 minute)

    user.verificationCode = verificationCode;
    user.verificationCodeExpires = codeExpires;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    await sendVerificationEmail(email, verificationCode);

    res.status(200).json({ message: "Verification code resent successfully." });
  } catch (error) {
    console.error("Resend error:", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  const { email, code } = req.body;
  
  if (!email || !code) {
    res.status(400).json({ message: "Email and code are required" });
    return;
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (user.isVerified) {
      res.status(200).json({ message: "Email is already verified" });
      return;
    }

    if (
      !user.verificationCode ||
      user.verificationCode !== code ||
      !user.verificationCodeExpires ||
      user.verificationCodeExpires < new Date()
    ) {
      res.status(400).json({ message: "Invalid or expired verification code" });
      return;
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const checkVerificationStatus = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.query;

  if (!email || typeof email !== "string") {
     res.status(400).json({ message: "Email is required" });
     return;
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
       res.status(404).json({ message: "User not found" });
       return;
    }

   res.status(200).json({ isVerified: user.isVerified });
   return;
  } catch (error) {
    console.error("Status check error:", error);
     res.status(500).json({ message: "Server error" });
     return;
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    // Check if email is verified
    if (!user.isVerified) {
      res.status(403).json({ message: "Please verify your email." });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    res.status(200).json({ user, token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

