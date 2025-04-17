// utils/sendEmail.ts
import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email: string, token: string) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASS!,
    },
  });

  // Dynamically select frontend URL based on environment
  const baseUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  const verificationLink = `${baseUrl}/verify-email?token=${token}&email=${email}`;

  await transporter.sendMail({
    from: `"Skill Match Team" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your email address",
    html: `
      <div style="background-color: #f4f4f4; padding: 20px; font-family: Arial, sans-serif;">
        <div style="
          max-width: 600px;
          margin: auto;
          background-color: #ffffff;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        ">
          <h2 style="color: #333;">Email Verification</h2>
          <p style="color: #555;">Hi there,</p>
          <p style="color: #555;">Please click the button below to verify your email address. This link will expire in 10 minutes.</p>
          
          <a href="${verificationLink}" style="
            display: inline-block;
            padding: 12px 24px;
            margin-top: 20px;
            color: white;
            background-color: #4f46e5;
            border-radius: 6px;
            text-decoration: none;
            font-weight: bold;
          ">Verify Email</a>

          <p style="margin-top: 30px; font-size: 12px; color: #999;">
            If you did not request this, you can safely ignore this email.
          </p>
        </div>
      </div>
    `,
  });
};
