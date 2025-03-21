import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN as string || "1h";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables.");
}

export const generateToken = (id: string): string => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"], 
  });
};
