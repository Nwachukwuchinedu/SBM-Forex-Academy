import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


export const sendVerificationEmail = async (email, token, firstName) => {
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: `"SBM Forex Academy" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: "Verify Your Email - SBM Forex Academy",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #6b21a8, #9333ea); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">SBM Forex Academy</h1>
        </div>
        <div style="padding: 30px; background-color: #f9fafb;">
          <h2 style="color: #333;">Welcome ${firstName}!</h2>
          <p style="color: #666; line-height: 1.6;">
            Thank you for joining SBM Forex Academy. To complete your registration and start your forex trading journey, please verify your email address.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background: #6b21a8; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Verify Email Address
            </a>
          </div>
         
          <p style="color: #666; font-size: 14px;">
            This verification link will expire in 24 hours.
          </p>
        </div>
        <div style="background-color: #e5e7eb; padding: 20px; text-align: center; font-size: 12px; color: #666;">
          <p>© 2024 SBM Forex Academy. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export default transporter;
