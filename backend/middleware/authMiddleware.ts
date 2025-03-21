import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";

interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  let token;

  // Extract token from Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
     res.status(401).json({ message: "Unauthorized - No token provided" });
     return;
  }

  try {
    // Verify JWT token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = await User.findById(decoded.userId).select("-password");

    if (!req.user) {
       res.status(401).json({ message: "User not found" });
       return;
    }

    next(); 
  } catch (error) {
    console.error("Authentication Error:", error);
    res.status(401).json({ message: "Invalid or Expired Token" });
  }
};
