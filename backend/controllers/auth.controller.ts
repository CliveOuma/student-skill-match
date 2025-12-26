import { Request, Response } from "express";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { hashPassword } from "../utils/hash";
import { sendVerificationEmail } from "../utils/sendEmail";

export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  // Validate input
  if (!name || !email || !password) {
    res.status(400).json({ message: "Name, email, and password are required" });
    return;
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Invalid email format" });
    return;
  }

  // Password validation
  if (password.length < 6) {
    res.status(400).json({ message: "Password must be at least 6 characters" });
    return;
  }

  try {
    console.log(`[REGISTER] Attempting to register user: ${email}`);
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`[REGISTER] Email already exists: ${email}`);
      res.status(400).json({ message: "Email already exists" });
      return;
    }

    console.log(`[REGISTER] Hashing password for: ${email}`);
    const hashedPassword = await hashPassword(password);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    const codeExpires = new Date(Date.now() + 60 * 1000); // 60 seconds (1 minute)

    console.log(`[REGISTER] Creating user in database: ${email}`);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      verificationCode,
      verificationCodeExpires: codeExpires,
      isVerified: false,
    });

    console.log(`[REGISTER] ✅ User created successfully: ${email} (ID: ${newUser._id})`);

    // Send response immediately
    res.status(201).json({ 
      message: "User registered successfully. Verification code sent to your email." 
    });

    // Send email asynchronously (don't block response)
    setImmediate(async () => {
      try {
        console.log(`[REGISTER] Attempting to send verification email to: ${email}`);
        // Wait for email with timeout (max 10 seconds)
        await Promise.race([
          sendVerificationEmail(email, verificationCode),
          new Promise<never>((_, reject) => {
            setTimeout(() => reject(new Error("Email timeout")), 10000);
          })
        ]);
        console.log(`[REGISTER] ✅ Verification email sent to ${email}`);
      } catch (emailError) {
        // Log error but don't fail registration
        const errorMsg = emailError instanceof Error ? emailError.message : String(emailError);
        console.error(`[REGISTER] ❌ Failed to send verification email to ${email}:`, errorMsg);
        // User is still registered, they can use resend functionality
      }
    });
  } catch (error) {
    // Detailed error logging for debugging
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : String(error);
    
    console.error("Registration error:", {
      message: errorMessage,
      stack: errorStack,
      email: email,
      timestamp: new Date().toISOString()
    });

    // Return more specific error messages for debugging (in production, be careful with sensitive info)
    if (errorMessage.includes("duplicate key") || errorMessage.includes("E11000")) {
      res.status(400).json({ message: "Email already exists" });
      return;
    }

    if (errorMessage.includes("validation")) {
      res.status(400).json({ message: "Invalid input data" });
      return;
    }

    // Generic error for production (don't expose internal details)
    res.status(500).json({ 
      message: "Registration failed. Please try again or contact support.",
      // Only include error details in development
      ...(process.env.NODE_ENV === "development" && { error: errorMessage })
    });
  }
};

export const resendVerificationEmail = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  if (!email) {
   res.status(400).json({ message: "Email is required" });
   return;
  }

  try {
    console.log(`[RESEND] Attempting to resend verification email to: ${email}`);
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`[RESEND] User not found: ${email}`);
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (user.isVerified) {
       console.log(`[RESEND] User already verified: ${email}`);
       res.status(400).json({ message: "Email already verified" });
       return;
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    const codeExpires = new Date(Date.now() + 60 * 1000); // 60 seconds (1 minute)

    console.log(`[RESEND] Generating new verification code for: ${email}`);
    user.verificationCode = verificationCode;
    user.verificationCodeExpires = codeExpires;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    console.log(`[RESEND] User updated, attempting to send email to: ${email}`);
    
    // Try to send email, but don't fail the request if email fails
    try {
      await sendVerificationEmail(email, verificationCode);
      console.log(`[RESEND] ✅ Verification email sent successfully to ${email}`);
    } catch (emailError) {
      const emailErrorMsg = emailError instanceof Error ? emailError.message : String(emailError);
      console.error(`[RESEND] ❌ Failed to send email to ${email}:`, emailErrorMsg);
      
      // Check if it's a configuration issue
      if (emailErrorMsg.includes("Email configuration is missing") || 
          emailErrorMsg.includes("not configured") ||
          emailErrorMsg.includes("EMAIL_USER") ||
          emailErrorMsg.includes("EMAIL_PASS")) {
        res.status(500).json({ 
          message: "Email service is not configured. Please contact support.",
          error: "EMAIL_CONFIG_MISSING"
        });
        return;
      }
      
      // For other email errors, still return success but log the error
      // User can try again later
      console.error(`[RESEND] Email failed but code was generated: ${verificationCode}`);
    }

    res.status(200).json({ message: "Verification code resent successfully." });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error("[RESEND] Error:", {
      message: errorMessage,
      stack: errorStack,
      email: email,
      timestamp: new Date().toISOString()
    });
    
    // Return more specific error messages
    if (errorMessage.includes("Email configuration is missing") || 
        errorMessage.includes("not configured")) {
      res.status(500).json({ 
        message: "Email service is not configured. Please contact support.",
        error: "EMAIL_CONFIG_MISSING"
      });
      return;
    }
    
    res.status(500).json({ 
      message: errorMessage || "Failed to resend verification code. Please try again.",
      error: process.env.NODE_ENV === "development" ? errorMessage : undefined
    });
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

