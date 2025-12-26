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
  // Validate email configuration first
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    const error = "Email configuration is missing. EMAIL_USER and EMAIL_PASS must be set.";
    console.error(`[EMAIL] ❌ ${error}`);
    throw new Error(error);
  }

  console.log(`[EMAIL] Preparing to send verification email to: ${email}`);
  console.log(`[EMAIL] Using sender: ${process.env.EMAIL_USER}`);
  console.log(`[EMAIL] Verification code: ${code}`);

  try {
    const emailTransporter = getOrCreateTransporter();
    console.log(`[EMAIL] Transporter created successfully`);
    
    const result = await emailTransporter.sendMail({
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

    console.log(`[EMAIL] ✅ Verification email sent successfully to ${email}`);
    console.log(`[EMAIL] Message ID: ${(result as any).messageId || 'N/A'}`);
    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error(`[EMAIL] ❌ Error sending verification email to ${email}:`);
    console.error(`[EMAIL] Error message: ${errorMessage}`);
    if (errorStack) {
      console.error(`[EMAIL] Stack trace:`, errorStack);
    }
    console.error(`[EMAIL] Full error object:`, error);
    
    // Re-throw with more context
    if (errorMessage.includes("Email configuration is missing") || 
        errorMessage.includes("EMAIL_USER") || 
        errorMessage.includes("EMAIL_PASS")) {
      throw new Error("Email service is not configured. Please contact support.");
    }
    
    if (errorMessage.includes("timeout")) {
      throw new Error("Email sending timed out. Please try again.");
    }
    
    if (errorMessage.includes("Invalid login") || errorMessage.includes("authentication")) {
      throw new Error("Email authentication failed. Please check email credentials.");
    }
    
    throw new Error(`Failed to send verification email: ${errorMessage}`);
  }
};