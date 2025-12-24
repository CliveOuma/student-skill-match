import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email: string, code: string) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASS!,
    },
  });

  try {
    await transporter.sendMail({
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
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send verification email");
  }
};