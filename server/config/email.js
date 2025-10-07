import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Optimized Zoho SMTP configuration for Render deployment
const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  port: 465,
  secure: true, // Use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // Optimized timeout settings for cloud environments
  tls: {
    rejectUnauthorized: false, // Accept self-signed certificates
    ciphers: "SSLv3",
  },
  connectionTimeout: 60000, // Increase to 60 seconds
  greetingTimeout: 60000, // Increase to 60 seconds
  socketTimeout: 60000, // Increase to 60 seconds
  logger: true, // Enable logging
  debug: true, // Enable debug output
});

// Enhanced email sending with better error handling
const sendEmailWithRetry = async (mailOptions, maxRetries = 2) => {
  console.log("Attempting to send email with Zoho SMTP...");
  console.log("Email configuration:", {
    host: "smtp.zoho.com",
    port: 465,
    secure: true,
    user: process.env.EMAIL_USER,
    hasPass: !!process.env.EMAIL_PASS,
  });

  for (let i = 0; i < maxRetries; i++) {
    try {
      console.log(`Email attempt ${i + 1}/${maxRetries}`);
      const result = await transporter.sendMail(mailOptions);
      console.log(`✅ Email sent successfully on attempt ${i + 1}`);
      return result;
    } catch (error) {
      console.error(`❌ Email attempt ${i + 1} failed:`, {
        message: error.message,
        code: error.code,
        command: error.command,
        stack: error.stack,
      });

      if (i === maxRetries - 1) {
        throw new Error(
          `Failed to send email after ${maxRetries} attempts. Last error: ${error.message}`
        );
      }

      // Wait 3 seconds before retrying (increased from 2)
      console.log(`Waiting 3 seconds before retry ${i + 2}...`);
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
};

export const sendVerificationEmail = async (email, token, firstName) => {
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from:
      process.env.EMAIL_FROM ||
      `"SBM Forex Academy" <${process.env.EMAIL_USER}>`,
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

  await sendEmailWithRetry(mailOptions);
};

export const sendPaymentConfirmationEmail = async (user, serviceInfo) => {
  const mailOptions = {
    from:
      process.env.EMAIL_FROM ||
      `"SBM Forex Academy" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: "Payment Confirmation - SBM Forex Academy",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #6b21a8, #9333ea); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">SBM Forex Academy</h1>
        </div>
        <div style="padding: 30px; background-color: #f9fafb;">
          <h2 style="color: #333;">Payment Confirmation</h2>
          <p style="color: #666; line-height: 1.6;">
            Dear ${user.firstName},<br><br>
            Thank you for your payment! Your subscription has been successfully activated.
          </p>
          
          <div style="background-color: #ffffff; border-radius: 8px; padding: 20px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h3 style="color: #6b21a8; margin-top: 0;">Service Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Service:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${serviceInfo.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Price:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;">$${serviceInfo.price}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Description:</strong></td>
                <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${serviceInfo.description}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Status:</strong></td>
                <td style="padding: 8px 0;"><span style="color: #10b981; font-weight: bold;">ACTIVE</span></td>
              </tr>
            </table>
          </div>
          
          <p style="color: #666; line-height: 1.6;">
            You now have full access to all educational content and services included in your subscription.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://sbmforexacademy.com" 
               style="background: #6b21a8; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Access Your Dashboard
            </a>
          </div>
        </div>
        <div style="background-color: #e5e7eb; padding: 20px; text-align: center; font-size: 12px; color: #666;">
          <p>© 2024 SBM Forex Academy. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  await sendEmailWithRetry(mailOptions);
};

// Test connection function
export const testEmailConnection = async () => {
  try {
    console.log("Testing email connection...");
    await transporter.verify();
    console.log("✅ Email server connection verified successfully");
    return true;
  } catch (error) {
    console.error("❌ Email server connection failed:", {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
    return false;
  }
};

export default transporter;
