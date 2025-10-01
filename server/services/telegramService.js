// Import required modules
import bot, { isAdminMiddleware } from "../utils/telegramBot.js";

// Function to start the Telegram bot
const startTelegramBot = async () => {
  try {
    console.log("Starting Telegram bot...");
    // Launch the bot
    await bot.launch();
    console.log("✅ Telegram bot is running");

    // Set up bot menu
    await setupBotMenu();

    // Set up graceful shutdown
    process.once("SIGINT", () => bot.stop("SIGINT"));
    process.once("SIGTERM", () => bot.stop("SIGTERM"));

    return bot;
  } catch (error) {
    console.error("❌ Failed to start Telegram bot:", error);
    throw error;
  }
};

// Function to set up bot menu
const setupBotMenu = async () => {
  try {
    await bot.telegram.setMyCommands([
      { command: "start", description: "Start the bot" },
      { command: "connect", description: "Connect your account" },
      { command: "token", description: "Connect using a token" },
      {
        command: "howtojoin",
        description: "Get instructions on how to join the group",
      },
      {
        command: "services",
        description: "View available services and payment information",
      },
      { command: "help", description: "Show help message" },
      { command: "logout", description: "Logout from your account" },
      // Admin-only commands (will be shown only to admins)
      { command: "broadcast", description: "Broadcast message to all paid users" },
      { command: "paidmessage", description: "Send paid-only message to group" },
      { command: "togglepayment", description: "Toggle user payment status" },
    ]);
    console.log("✅ Telegram bot menu configured");
  } catch (error) {
    console.error("❌ Failed to configure Telegram bot menu:", error);
  }
};

// Function to stop the Telegram bot
const stopTelegramBot = async () => {
  try {
    await bot.stop();
    console.log("🛑 Telegram bot stopped");
  } catch (error) {
    console.error("Error stopping Telegram bot:", error);
  }
};

// Export the service functions
export { startTelegramBot, stopTelegramBot, setupBotMenu };
