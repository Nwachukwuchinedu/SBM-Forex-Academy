// Import required modules
import bot from "../utils/telegramBot.js";

// Function to start the Telegram bot
const startTelegramBot = async () => {
  try {
    console.log("Starting Telegram bot...");

    // Set up bot menu
    await setupBotMenu();

    // Launch the bot
    await bot.launch();
    console.log("✅ Telegram bot is running");

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
      { command: "token", description: "Connect using a token" },
      { command: "help", description: "Show help message" },
      { command: "logout", description: "Logout from your account" },
    ]);

    // Set bot description that users see before starting
    await bot.telegram.setMyDescription(
      "Welcome to SBM Forex Academy! 🚀\n\n" +
        "Connect your account to access educational content, trading signals, and premium services.\n\n" +
        "Features:\n" +
        "• Account Management Services\n" +
        "• Trading Signal Provision\n" +
        "• Educational Content Access\n" +
        "• Payment Status Management\n\n" +
        "Use /start to begin your journey with us!"
    );

    // Set bot short description (shown in chat list)
    await bot.telegram.setMyShortDescription(
      "SBM Forex Academy - Your gateway to professional forex trading education and services"
    );

    console.log("✅ Telegram bot menu and descriptions configured");
  } catch (error) {
    console.error(
      "❌ Failed to configure Telegram bot menu and descriptions:",
      error
    );
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
