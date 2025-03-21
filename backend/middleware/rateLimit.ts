import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 10 minutes
  max: 5, // limit each IP to 5 login requests per window
  message: JSON.stringify({ message: "Too many login attempts, try again later." }),
  standardHeaders: true,
  legacyHeaders: false,
});
