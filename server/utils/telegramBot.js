// Import required modules
import { Telegraf, Markup } from "telegraf";
import dotenv from "dotenv";
import User from "../models/User.js";
import Admin from "../models/Admin.js";
import axios from "axios";

// Load environment variables
dotenv.config();

// Initialize the bot with the token from environment variables
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Error handling middleware
bot.catch((error) => {
  console.error("Telegram Bot Error:", error);
});

// Set bot commands menu - only general commands for all users
bot.telegram.setMyCommands([
  { command: "start", description: "Start the bot" },
  { command: "connect", description: "Connect your account" },
  { command: "token", description: "Connect using a token" },
  { command: "help", description: "Show help message" },
]);

// Get admin ID from database
const getAdminId = async () => {
  try {
    const admin = await Admin.findOne({ role: "admin" });
    return admin && admin.telegramId ? admin.telegramId : null;
  } catch (error) {
    console.error("Error fetching admin ID:", error);
    return null;
  }
};

// Check if user is admin (for inline keyboard actions)
const checkAdmin = async (ctx) => {
  try {
    const userId = ctx.from.id;
    const adminId = await getAdminId();
    return adminId && userId.toString() === adminId.toString();
  } catch (error) {
    console.error("Error in admin check:", error);
    return false;
  }
};

// Enhanced verification function for admin users
const verifyAdminConnection = async (userId, connectionToken) => {
  try {
    // First, we need to find the user associated with this token
    // We'll need to access the connectionTokens map from the telegram controller
    // For now, let's implement a simplified version by checking the database

    // Find the admin user
    const admin = await Admin.findOne({ role: "admin" });

    if (!admin) {
      return { isValid: false, message: "No admin user found in the system." };
    }

    // Check if the admin has set their Telegram ID
    if (!admin.telegramId) {
      return {
        isValid: false,
        message: "Admin has not set their Telegram ID in the dashboard.",
      };
    }

    // Check if the Telegram ID matches
    if (admin.telegramId.toString() !== userId.toString()) {
      return {
        isValid: false,
        message:
          "The Telegram ID does not match the one set in the admin dashboard.",
      };
    }

    // If we get here, the user is verified as admin
    return { isValid: true, admin };
  } catch (error) {
    console.error("Error verifying admin connection:", error);
    return {
      isValid: false,
      message: "An error occurred while verifying admin credentials.",
    };
  }
};

// Show main menu based on user role
const showMainMenu = async (ctx, user) => {
  // Check if this is an admin user
  const adminId = await getAdminId();
  const isAdminUser = adminId && ctx.from.id.toString() === adminId.toString();

  if (isAdminUser) {
    // Admin menu
    await ctx.reply(
      `🛡️ *Admin Dashboard*\n\nWelcome ${user.firstName || user.username}!`,
      Markup.inlineKeyboard([
        [Markup.button.callback("📊 Check Status", "check_status")],
        [Markup.button.callback("👥 Manage Users", "manage_users")],
        [Markup.button.callback("📢 Broadcast Message", "broadcast")],
        [Markup.button.callback("🔄 Toggle Payment", "toggle_payment")],
        [Markup.button.callback("❓ Help", "help")],
        [Markup.button.callback("🚪 Logout", "logout")],
      ]).oneTime()
    );
  } else {
    // Regular user menu
    await ctx.reply(
      `👤 *User Dashboard*\n\nWelcome ${user.firstName}!`,
      Markup.inlineKeyboard([
        [Markup.button.callback("📊 Check Status", "check_status")],
        [Markup.button.callback("❓ Help", "help")],
        [Markup.button.callback("🚪 Logout", "logout")],
      ]).oneTime()
    );
  }
};

// Start command - Welcome message with role-based keyboard
bot.start(async (ctx) => {
  try {
    const userId = ctx.from.id;

    // Check if this is an admin
    const adminId = await getAdminId();
    const isAdminUser = adminId && userId.toString() === adminId.toString();

    if (isAdminUser) {
      const admin = await Admin.findOne({ role: "admin", telegramId: userId });
      if (admin) {
        await ctx.reply(`Welcome back Admin! You are logged in.`);
        await showMainMenu(ctx, admin);
        return;
      }
    }

    // Check if this is a regular user
    const user = await User.findOne({ telegramId: userId });
    if (user) {
      await ctx.reply(`Welcome back ${user.firstName}! You are logged in.`);
      await showMainMenu(ctx, user);
      return;
    }

    await ctx.reply(
      "Welcome! Please log in to your account to connect with the bot.",
      Markup.inlineKeyboard([
        Markup.button.callback("Connect Account", "connect_account"),
        Markup.button.callback("Help", "help"),
      ])
    );
  } catch (error) {
    console.error("Error in start command:", error);
    await ctx.reply("An error occurred. Please try again later.");
  }
});

// Handle callback queries (button presses) with proper role checking
bot.action("connect_account", async (ctx) => {
  await ctx.reply(
    `🔗 *Account Connection* \n\n` +
      `To connect your SBM Forex Academy account with this Telegram bot: \n\n` +
      `1. Log in to your SBM Forex Academy account on the website \n` +
      `2. Go to Account Settings \n` +
      `3. Click "Generate Connection Token" \n` +
      `4. Copy the generated token \n` +
      `5. Send the token to this bot using the command: /token YOUR_TOKEN_HERE \n\n` +
      `Once connected, you'll receive educational content from the group.`,
    { parse_mode: "Markdown" }
  );
});

bot.action("check_status", async (ctx) => {
  try {
    const userId = ctx.from.id;

    // Check if this is an admin
    const adminId = await getAdminId();
    const isAdminUser = adminId && userId.toString() === adminId.toString();

    if (isAdminUser) {
      const admin = await Admin.findOne({ role: "admin", telegramId: userId });
      if (admin) {
        await ctx.reply(
          `🛡️ *Admin Status* \n\n` +
            `Username: ${admin.username} \n` +
            `Email: ${admin.email} \n` +
            `Role: *ADMIN* \n\n` +
            `You have full administrative privileges.`,
          { parse_mode: "Markdown" }
        );
        await showMainMenu(ctx, admin);
        return;
      }
    }

    // Check regular user
    const user = await User.findOne({ telegramId: userId });
    if (!user) {
      await ctx.reply(
        "ℹ️ You are not yet connected to your SBM Forex Academy account. \n" +
          "Use /connect to link your account and receive educational content.",
        { parse_mode: "Markdown" }
      );
      return;
    }

    await ctx.reply(
      `📊 *Payment Status* \n\n` +
        `Name: ${user.firstName} ${user.lastName} \n` +
        `Email: ${user.email} \n` +
        `Status: *${user.paymentStatus ? "ACTIVE" : "INACTIVE"}* \n\n` +
        (user.paymentStatus
          ? "✅ You have full access to educational content from the group."
          : "❌ You currently don't have access to educational content. Contact admin for assistance.") +
        "\n",
      { parse_mode: "Markdown" }
    );

    // Show menu again
    await showMainMenu(ctx, user);
  } catch (error) {
    console.error("Error in status check:", error);
    await ctx.reply(
      "An error occurred while checking your status. Please try again later."
    );
  }
});

bot.action("help", async (ctx) => {
  const userId = ctx.from.id;

  // Check if this is an admin
  const adminId = await getAdminId();
  const isAdminUser = adminId && userId.toString() === adminId.toString();

  let message = "🚀 *SBM Forex Academy Bot* \n\n";

  if (isAdminUser) {
    message += "You are logged in as an Administrator. \n\n";
  } else {
    // Check if regular user is connected
    const user = await User.findOne({ telegramId: userId });
    if (!user) {
      message +=
        "You are not yet connected to your SBM Forex Academy account. \n\n";
      message += "Please use /connect to link your account first. \n\n";
    }
  }

  // General user commands (available to everyone)
  message += "Available commands: \n\n";
  message += "👤 General: \n";
  message += "• /start - Start the bot \n";
  message += "• /connect - Connect your account \n";
  message += "• /token - Connect using a token \n";
  message += "• /help - Show this help message \n";
  message += "• /logout - Logout from your account \n\n";

  await ctx.reply(message, { parse_mode: "Markdown" });

  // Show menu again if user is connected
  const admin = isAdminUser
    ? await Admin.findOne({ role: "admin", telegramId: userId })
    : null;
  const user = await User.findOne({ telegramId: userId });
  if (admin) {
    await showMainMenu(ctx, admin);
  } else if (user) {
    await showMainMenu(ctx, user);
  }
});

bot.action("logout", async (ctx) => {
  try {
    const userId = ctx.from.id;

    // Remove telegramId from user document
    const userResult = await User.findOneAndUpdate(
      { telegramId: userId },
      { $unset: { telegramId: "" } },
      { new: true }
    );

    // Also check if this is an admin
    const adminResult = await Admin.findOneAndUpdate(
      { telegramId: userId },
      { $unset: { telegramId: "" } },
      { new: true }
    );

    if (userResult || adminResult) {
      await ctx.reply(
        "✅ You have been successfully logged out. \n\n" +
          "To reconnect, generate a new token from your account settings on the website.",
        Markup.inlineKeyboard([
          Markup.button.callback("Connect Account", "connect_account"),
          Markup.button.callback("Help", "help"),
        ])
      );
    } else {
      await ctx.reply(
        "ℹ️ You are not connected to any account. \n\n" +
          "Use /connect to link your account.",
        Markup.inlineKeyboard([
          Markup.button.callback("Connect Account", "connect_account"),
          Markup.button.callback("Help", "help"),
        ])
      );
    }
  } catch (error) {
    console.error("Error in logout:", error);
    await ctx.reply(
      "An error occurred while logging out. Please try again later."
    );
  }
});

// Admin-only actions
bot.action("manage_users", async (ctx) => {
  // Check if user is admin
  const isAdminUser = await checkAdmin(ctx);

  if (!isAdminUser) {
    await ctx.reply("❌ You do not have permission to perform this action.");
    // Show regular user menu
    const userId = ctx.from.id;
    const user = await User.findOne({ telegramId: userId });
    if (user) {
      await showMainMenu(ctx, user);
    }
    return;
  }

  try {
    const users = await User.find({}).sort({ createdAt: -1 });

    if (!users || users.length === 0) {
      await ctx.reply("📭 No users found in the system.");
      return;
    }

    // Create a summary message with user information
    let message = `📋 *User Management* (${users.length} users)\n\n`;

    // Group users by payment status
    const paidUsers = users.filter((user) => user.paymentStatus);
    const unpaidUsers = users.filter((user) => !user.paymentStatus);

    message += `✅ *Paid Users* (${paidUsers.length}):\n`;
    paidUsers.forEach((user) => {
      message += `• ${user.firstName} ${user.lastName} (${user.email}) ${
        user.telegramId ? "(Connected)" : "(Not Connected)"
      }\n`;
    });

    message += `\n❌ *Not Paid Users* (${unpaidUsers.length}):\n`;
    unpaidUsers.forEach((user) => {
      message += `• ${user.firstName} ${user.lastName} (${user.email}) ${
        user.telegramId ? "(Connected)" : "(Not Connected)"
      }\n`;
    });

    await ctx.reply(message, { parse_mode: "Markdown" });

    // Show admin menu again
    const adminUser = await Admin.findOne({ telegramId: ctx.from.id });
    if (adminUser) {
      await showMainMenu(ctx, adminUser);
    }
  } catch (error) {
    console.error("Error in manage users:", error);
    await ctx.reply(
      "An error occurred while fetching user data. Please try again later."
    );
  }
});

bot.action("broadcast", async (ctx) => {
  // Check if user is admin
  const isAdminUser = await checkAdmin(ctx);

  if (!isAdminUser) {
    await ctx.reply("❌ You do not have permission to perform this action.");
    // Show regular user menu
    const userId = ctx.from.id;
    const user = await User.findOne({ telegramId: userId });
    if (user) {
      await showMainMenu(ctx, user);
    }
    return;
  }

  await ctx.reply(
    "📢 *Broadcast Message* \n\n" +
      "To broadcast a message to all paying users, use the command: \n" +
      "/broadcast Your message here",
    { parse_mode: "Markdown" }
  );
});

bot.action("toggle_payment", async (ctx) => {
  // Check if user is admin
  const isAdminUser = await checkAdmin(ctx);

  if (!isAdminUser) {
    await ctx.reply("❌ You do not have permission to perform this action.");
    // Show regular user menu
    const userId = ctx.from.id;
    const user = await User.findOne({ telegramId: userId });
    if (user) {
      await showMainMenu(ctx, user);
    }
    return;
  }

  await ctx.reply(
    "🔄 *Toggle Payment Status* \n\n" +
      "To toggle a user's payment status, use the command: \n" +
      "/togglepayment [user_telegram_id]",
    { parse_mode: "Markdown" }
  );
});

// Command to connect user account
bot.command("connect", async (ctx) => {
  try {
    const userId = ctx.from.id;

    await ctx.reply(
      `🔗 *Account Connection* \n\n` +
        `To connect your SBM Forex Academy account with this Telegram bot: \n\n` +
        `1. Log in to your SBM Forex Academy account on the website \n` +
        `2. Go to Account Settings \n` +
        `3. Click "Generate Connection Token" \n` +
        `4. Copy the generated token \n` +
        `5. Send the token to this bot using the command: /token YOUR_TOKEN_HERE \n\n` +
        `Once connected, you'll receive educational content from the group.`,
      { parse_mode: "Markdown" }
    );
  } catch (error) {
    console.error("Error in connect command:", error);
    await ctx.reply(
      "An error occurred while providing connection instructions. Please try again later."
    );
  }
});

// Command to handle token submission
bot.command("token", async (ctx) => {
  try {
    const userId = ctx.from.id;
    const args = ctx.message.text.split(" ");

    if (args.length < 2) {
      await ctx.reply(
        "❌ Please provide a connection token. \n\n" +
          "Usage: /token YOUR_TOKEN_HERE \n\n" +
          "Generate a token from your account settings on the website."
      );
      return;
    }

    const token = args[1];

    // Check if this Telegram account is already connected to another user
    const existingUser = await User.findOne({ telegramId: userId });
    const existingAdmin = await Admin.findOne({ telegramId: userId });

    if (existingUser || existingAdmin) {
      await ctx.reply(
        "❌ This Telegram account is already connected to an account. \n\n" +
          "Please logout first using the /logout command before connecting a new account.",
        { parse_mode: "Markdown" }
      );
      return;
    }

    // Make API call to validate the token and connect the account
    try {
      const response = await axios.post(
        `${
          process.env.API_BASE_URL || "http://localhost:5000"
        }/api/telegram-validation/validate-token`,
        {
          telegramId: userId.toString(),
          connectionToken: token,
        }
      );

      const result = response.data;

      if (result.success) {
        // Check if this is an admin user
        const adminId = await getAdminId();
        const isAdminUser = adminId && userId.toString() === adminId.toString();

        if (isAdminUser) {
          // Additional verification for admin users
          const adminVerification = await verifyAdminConnection(userId, token);
          if (!adminVerification.isValid) {
            await ctx.reply(
              `❌ *Admin Verification Failed* \n\n` +
                `${adminVerification.message} \n\n` +
                `Please ensure you've set your Telegram ID in the admin dashboard and try again.`,
              { parse_mode: "Markdown" }
            );
            return;
          }

          await ctx.reply(
            "✅ *Admin Connection Successful* \n\n" +
              "Welcome Admin! Your Telegram account is now connected. \n\n" +
              "You have full administrative privileges.",
            { parse_mode: "Markdown" }
          );

          // Show admin menu
          await showMainMenu(ctx, adminVerification.admin);
        } else {
          await ctx.reply(
            "✅ *Connection Successful* \n\n" +
              "Welcome " +
              result.data.firstName +
              "! Your Telegram account is now connected. \n\n" +
              "Payment Status: *" +
              (result.data.paymentStatus ? "ACTIVE" : "INACTIVE") +
              "* \n\n" +
              "You will " +
              (result.data.paymentStatus ? "now" : "not") +
              " receive educational content from the group.",
            { parse_mode: "Markdown" }
          );

          // Show the appropriate menu based on user role
          const user = await User.findOne({ telegramId: userId });
          if (user) {
            await showMainMenu(ctx, user);
          }
        }
      } else {
        await ctx.reply(
          "❌ *Connection Failed* \n\n" +
            result.message +
            " \n\n" +
            "Please generate a new token and try again."
        );
      }
    } catch (apiError) {
      console.error("Error calling validation API:", apiError);
      await ctx.reply(
        "❌ *Connection Failed* \n\n" +
          "An error occurred while validating your token. Please try again later."
      );
    }
  } catch (error) {
    console.error("Error in token command:", error);
    await ctx.reply(
      "An error occurred while processing your token. Please try again later."
    );
  }
});

// Logout command
bot.command("logout", async (ctx) => {
  try {
    const userId = ctx.from.id;

    // Remove telegramId from user document
    const userResult = await User.findOneAndUpdate(
      { telegramId: userId },
      { $unset: { telegramId: "" } },
      { new: true }
    );

    // Also check if this is an admin
    const adminResult = await Admin.findOneAndUpdate(
      { telegramId: userId },
      { $unset: { telegramId: "" } },
      { new: true }
    );

    if (userResult || adminResult) {
      await ctx.reply(
        "✅ You have been successfully logged out. \n\n" +
          "To reconnect, generate a new token from your account settings on the website."
      );
    } else {
      await ctx.reply(
        "ℹ️ You are not connected to any account. \n\n" +
          "Use /connect to link your account."
      );
    }
  } catch (error) {
    console.error("Error in logout command:", error);
    await ctx.reply(
      "An error occurred while logging out. Please try again later."
    );
  }
});

// Help command
bot.help(async (ctx) => {
  const userId = ctx.from.id;

  // Check if this is an admin
  const adminId = await getAdminId();
  const isAdminUser = adminId && userId.toString() === adminId.toString();

  let message = "🚀 *SBM Forex Academy Bot* \n\n";

  if (isAdminUser) {
    message += "You are logged in as an Administrator. \n\n";
  } else {
    // Check if regular user is connected
    const user = await User.findOne({ telegramId: userId });
    if (!user) {
      message +=
        "You are not yet connected to your SBM Forex Academy account. \n\n";
      message += "Please use /connect to link your account first. \n\n";
    }
  }

  // General user commands (available to everyone)
  message += "Available commands: \n\n";
  message += "👤 General: \n";
  message += "• /start - Start the bot \n";
  message += "• /connect - Connect your account \n";
  message += "• /token - Connect using a token \n";
  message += "• /help - Show this help message \n";
  message += "• /logout - Logout from your account \n\n";

  await ctx.reply(message, { parse_mode: "Markdown" });

  // Show menu again if user is connected
  const admin = isAdminUser
    ? await Admin.findOne({ role: "admin", telegramId: userId })
    : null;
  const user = await User.findOne({ telegramId: userId });
  if (admin) {
    await showMainMenu(ctx, admin);
  } else if (user) {
    await showMainMenu(ctx, user);
  }
});

// Middleware to check if user is admin
const isAdminMiddleware = async (ctx, next) => {
  try {
    const userId = ctx.from.id;
    const adminId = await getAdminId();

    // Check if this user ID matches the admin ID in the database
    if (adminId && userId.toString() === adminId.toString()) {
      return next();
    }

    await ctx.reply(
      "❌ You do not have permission to perform this action. Admin access required."
    );
  } catch (error) {
    console.error("Error in admin check:", error);
    await ctx.reply("An error occurred while verifying your admin status.");
  }
};

// Admin-only command to toggle user payment status
bot.command("togglepayment", isAdminMiddleware, async (ctx) => {
  try {
    // Get the user email from command arguments
    const args = ctx.message.text.split(" ");

    if (args.length < 2) {
      await ctx.reply(
        "❌ Please provide a user email. Usage: /togglepayment user@example.com"
      );
      return;
    }

    const userEmail = args[1];

    // Find the user by email
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      await ctx.reply(
        "❌ User with email " + userEmail + " not found in our system."
      );
      return;
    }

    // Toggle the payment status
    user.paymentStatus = !user.paymentStatus;
    await user.save();

    await ctx.reply(
      "✅ Successfully updated payment status for " +
        user.firstName +
        " " +
        user.lastName +
        " (" +
        user.email +
        ")\n" +
        "New status: *" +
        (user.paymentStatus ? "Paid" : "Not Paid") +
        "*",
      { parse_mode: "Markdown" }
    );

    // Send a notification to the user about their status change
    if (user.telegramId) {
      try {
        await bot.telegram.sendMessage(
          user.telegramId,
          `🔔 *Payment Status Update* \n\n` +
            `Your access status has been changed to *${
              user.paymentStatus ? "ACTIVE" : "INACTIVE"
            }* \n` +
            `You are now ${
              user.paymentStatus
                ? "able to receive educational content"
                : "no longer able to receive educational content"
            } from the group.`,
          { parse_mode: "Markdown" }
        );
      } catch (error) {
        console.error(
          `Failed to send notification to user ${user.telegramId}:`,
          error
        );
      }
    }
  } catch (error) {
    console.error("Error in togglepayment command:", error);
    await ctx.reply(
      "An error occurred while updating the payment status. Please try again later."
    );
  }
});

// Admin-only command to broadcast message to paying users
bot.command("broadcast", isAdminMiddleware, async (ctx) => {
  try {
    // Extract message from command
    const args = ctx.message.text.split(" ");

    if (args.length < 2) {
      await ctx.reply(
        "❌ Please provide a message to broadcast. Usage: /broadcast [your message]"
      );
      return;
    }

    const message = args.slice(1).join(" ");

    // Find all paying users with Telegram IDs
    const payingUsers = await User.find({
      paymentStatus: true,
      telegramId: { $ne: null },
    });

    if (!payingUsers || payingUsers.length === 0) {
      await ctx.reply(
        "📭 No paying users found to receive the broadcast message."
      );
      return;
    }

    let successCount = 0;
    let failureCount = 0;

    // Send message to each paying user
    for (const user of payingUsers) {
      try {
        await bot.telegram.sendMessage(
          user.telegramId,
          `📢 *Broadcast Message* \n\n${message}`,
          { parse_mode: "Markdown" }
        );
        successCount++;
      } catch (error) {
        console.error(
          `Failed to send broadcast to user ${user.telegramId}:`,
          error
        );
        failureCount++;
      }
    }

    await ctx.reply(
      "📬 *Broadcast Summary* \n\n" +
        "Total paying users: " +
        payingUsers.length +
        " \n" +
        "Successfully delivered: " +
        successCount +
        " \n" +
        "Failed deliveries: " +
        failureCount +
        " \n\n" +
        (failureCount > 0
          ? "Some users may have blocked the bot or deleted their account."
          : ""),
      { parse_mode: "Markdown" }
    );
  } catch (error) {
    console.error("Error in broadcast command:", error);
    await ctx.reply(
      "An error occurred while sending the broadcast message. Please try again later."
    );
  }
});

// Function to check if a user should receive messages
const canReceiveMessages = async (userId) => {
  try {
    const user = await User.findOne({ telegramId: userId });
    return user && user.paymentStatus;
  } catch (error) {
    console.error("Error checking user payment status:", error);
    return false;
  }
};

// Listen for new messages in the group
bot.on("message", async (ctx) => {
  try {
    // Check if the message is from the designated group
    if (ctx.chat.id.toString() === process.env.TELEGRAM_GROUP_ID) {
      // Get the message sender's information
      const senderId = ctx.message.from.id;

      // Get admin ID from database
      const adminId = await getAdminId();

      // Only allow admins to post messages that get forwarded
      if (!adminId || senderId.toString() !== adminId.toString()) {
        // Optionally send a private message to non-admins explaining the restriction
        try {
          await bot.telegram.sendMessage(
            senderId,
            "ℹ️ Only administrators can post messages that will be forwarded to students. Please contact an admin if you need to share important information."
          );
        } catch (error) {
          console.error(`Failed to send info message to ${senderId}:`, error);
        }
        return;
      }

      // Get all paying users with connected Telegram accounts
      const payingUsers = await User.find({
        paymentStatus: true,
        telegramId: { $ne: null },
      });

      if (!payingUsers || payingUsers.length === 0) {
        console.log("No paying users to forward message to");
        return;
      }

      let successCount = 0;
      let failureCount = 0;

      // Forward the message to each paying user
      for (const user of payingUsers) {
        try {
          // Copy the message to the user
          await ctx.copyMessage(user.telegramId);
          successCount++;
        } catch (error) {
          console.error(
            `Failed to forward message to user ${user.telegramId}:`,
            error
          );
          failureCount++;
        }
      }

      // Send summary to admin
      try {
        await ctx.reply(
          "📬 *Message Distribution Summary* \n\n" +
            "Total paying users: " +
            payingUsers.length +
            " \n" +
            "Successfully delivered: " +
            successCount +
            " \n" +
            "Failed deliveries: " +
            failureCount +
            " \n\n" +
            (failureCount > 0
              ? "Some users may have blocked the bot or deleted their account."
              : ""),
          { parse_mode: "Markdown" }
        );
      } catch (error) {
        console.error("Failed to send distribution summary:", error);
      }
    }
  } catch (error) {
    console.error("Error in message forwarding:", error);
  }
});

// Export the bot instance and helper functions
export default bot;
export { isAdminMiddleware, canReceiveMessages };
