// Import required modules
import bot, { isAdminMiddleware } from "../utils/telegramBot.js";

// Function to start the Telegram bot
const startTelegramBot = async () => {
  try {
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
      { command: "status", description: "Check your payment status" },
      { command: "help", description: "Show help message" },
      { command: "menu", description: "Show bot menu" },
      { command: "admin", description: "Admin panel (admin only)" },
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
