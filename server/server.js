import app from "./app.js";
import dotenv from "dotenv";
import "./utils/keepAlive.js";
import {
  startTelegramBot,
  stopTelegramBot,
} from "./services/telegramService.js";
import { schedulePaymentExpirationChecker } from "./utils/paymentExpirationChecker.js";
import { testEmailConnection } from "./config/email.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Start both HTTP server and Telegram bot
const httpServer = app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);

  try {
    // Test email connection with detailed logging
    console.log("📧 Testing email configuration...");
    const emailConnected = await testEmailConnection();
    if (emailConnected) {
      console.log("✅ Email service is ready");
    } else {
      console.log("⚠️ Email service connection failed - check configuration");
      const disableEmails = String(process.env.DISABLE_EMAILS).toLowerCase() === "true";
      console.log("Current email config (non-sensitive):", {
        SENDGRID_SENDER: process.env.SENDGRID_SENDER,
        hasSendGridApiKey: !!process.env.SENDGRID_API_KEY,
        disableEmails,
      });
    }

    // Start Telegram bot
    console.log("🤖 Starting Telegram bot...");
    await startTelegramBot();

    // Schedule payment expiration checker
    console.log("⏰ Scheduling payment expiration checker...");
    schedulePaymentExpirationChecker();

    console.log("🎉 All services initialized successfully!");
  } catch (error) {
    console.error("❌ Failed to start services:", error.message);
    console.error("Stack:", error.stack);
  }
});

// Handle graceful shutdown
process.on("SIGTERM", async () => {
  console.log("🛑 SIGTERM received. Shutting down gracefully...");

  // Stop Telegram bot
  await stopTelegramBot();

  // Close HTTP server
  httpServer.close(() => {
    console.log("🔒 HTTP server closed");
    process.exit(0);
  });
});

process.on("SIGINT", async () => {
  console.log("🛑 SIGINT received. Shutting down gracefully...");

  // Stop Telegram bot
  await stopTelegramBot();

  // Close HTTP server
  httpServer.close(() => {
    console.log("🔒 HTTP server closed");
    process.exit(0);
  });
});
