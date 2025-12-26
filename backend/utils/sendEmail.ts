import nodemailer from "nodemailer";

// Validate email configuration
const getTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("Email configuration is missing. EMAIL_USER and EMAIL_PASS must be set.");
  }

  return nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // Add connection timeout
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });
};

// Create transporter lazily (only when needed)
let transporter: nodemailer.Transporter | null = null;

const getOrCreateTransporter = (): nodemailer.Transporter => {
  if (!transporter) {
    transporter = getTransporter();
  }
  return transporter;
};

export const sendVerificationEmail = async (email: string, code: string) => {
  try {
    const emailTransporter = getOrCreateTransporter();
    
    // Add timeout wrapper
    const emailPromise = emailTransporter.sendMail({
      from: `"Skill Match Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verification code",
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
            <h2 style="color: #333;">Verify your email</h2>
            <p style="color: #555;">Hi there,</p>
            <p style="color: #555;">Use the verification code below to complete your registration.</p>
            <div style="
              margin-top: 20px;
              padding: 16px;
              text-align: center;
              background-color: #f5f5ff;
              border: 1px solid #e0e7ff;
              border-radius: 8px;
              font-size: 24px;
              letter-spacing: 6px;
              font-weight: bold;
              color: #4f46e5;
            ">${code}</div>

            <p style="margin-top: 30px; font-size: 12px; color: #999;">
              If you did not request this, you can safely ignore this email.
            </p>
          </div>
        </div>
      `,
    });

    // Add timeout (15 seconds max for production reliability)
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Email sending timeout after 15 seconds")), 15000);
    });

    await Promise.race([emailPromise, timeoutPromise]);
    console.log(`Verification email sent successfully to ${email}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`Error sending verification email to ${email}:`, errorMessage);
    
    // Re-throw with more context
    if (errorMessage.includes("Email configuration is missing")) {
      throw new Error("Email service is not configured. Please contact support.");
    }
    throw new Error(`Failed to send verification email: ${errorMessage}`);
  }
};