import app from "./app.js";
import dotenv from "dotenv";
import "./utils/keepAlive.js";
import {
  startTelegramBot,
  stopTelegramBot,
} from "./services/telegramService.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Start both HTTP server and Telegram bot
const httpServer = app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  try {
    // Start Telegram bot
    await startTelegramBot();
  } catch (error) {
    console.error(
      "Failed to start Telegram bot. The web server is running but Telegram functionality is disabled."
    );
    console.error(error);
  }
});

// Handle graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received. Shutting down gracefully...");

  // Stop Telegram bot
  await stopTelegramBot();

  // Close HTTP server
  httpServer.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});

process.on("SIGINT", async () => {
  console.log("SIGINT received. Shutting down gracefully...");

  // Stop Telegram bot
  await stopTelegramBot();

  // Close HTTP server
  httpServer.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});
