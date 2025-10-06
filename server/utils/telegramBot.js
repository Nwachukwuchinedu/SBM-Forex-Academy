// Import required modules
import { Telegraf, Markup, session } from "telegraf";
import dotenv from "dotenv";

import mongoose from "mongoose";
import User from "../models/User.js";
import Admin from "../models/Admin.js";
import Payment from "../models/Payment.js";
import axios from "axios";

// Load environment variables
dotenv.config();

// Initialize the bot with the token from environment variables
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Add session middleware
bot.use(session());

// Error handling middleware
bot.catch((error) => {
  console.error("Telegram Bot Error:", error);
});

// Middleware to block commands in groups (except admin commands)
bot.use(async (ctx, next) => {
  // Check if this is a group and if it's a command
  if (
    (ctx.chat.type === "group" || ctx.chat.type === "supergroup") &&
    ctx.message &&
    ctx.message.text &&
    ctx.message.text.startsWith("/")
  ) {
    const command = ctx.message.text.split(" ")[0];

    // Allow admin commands in groups
    const adminCommands = ["/paidmessage", "/broadcast", "/togglepayment"];
    if (adminCommands.includes(command)) {
      // Check if user is admin before allowing
      try {
        const adminInfo = await getAdminInfo();
        const isAdminUser =
          adminInfo.adminId &&
          ctx.from.id.toString() === adminInfo.adminId.toString();

        if (isAdminUser) {
          // Allow admin command to proceed
          return next();
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
      }
    }

    // Block ALL other commands in groups and redirect to private chat
    await ctx.reply(
      `👋 Hi ${ctx.from.first_name || "there"}!\n\n` +
        `Commands should be used privately with the bot, not in the group.\n\n` +
        `Please start a private conversation with me and use your commands there! 😊\n\n` +
        `Click here to start: [Start Private Chat](https://t.me/${
          process.env.BOT_USERNAME || "SBMforexbot"
        })\n\n` +
        `Available commands: /start, /services, /help`,
      { parse_mode: "Markdown" }
    );
    return; // Stop execution, don't call next()
  }

  // If not a group command, continue to normal handlers
  return next();
});

// Set bot commands menu - only general commands for all users
bot.telegram.setMyCommands([
  { command: "start", description: "Start the bot" },
  { command: "token", description: "Connect using a token" },
  { command: "help", description: "Show help message" },
  { command: "logout", description: "Logout from your account" },
]);

// Set bot description that users see before starting
bot.telegram
  .setMyDescription(
    "Welcome to SBM Forex Academy! 🚀\n\n" +
      "Connect your account to access educational content, trading signals, and premium services.\n\n" +
      "Features:\n" +
      "• Account Management Services\n" +
      "• Trading Signal Provision\n" +
      "• Educational Content Access\n" +
      "• Payment Status Management\n\n" +
      "Use /start to begin your journey with us!"
  )
  .catch((error) => {
    console.error("Failed to set bot description:", error);
  });

// Set bot short description (shown in chat list)
bot.telegram
  .setMyShortDescription(
    "SBM Forex Academy - Your gateway to professional forex trading education and services"
  )
  .catch((error) => {
    console.error("Failed to set bot short description:", error);
  });

// Get admin ID and group invite link from database
const getAdminInfo = async () => {
  try {
    const admin = await Admin.findOne({ role: "admin" });
    return {
      adminId: admin && admin.telegramId ? admin.telegramId : null,
      groupInviteLink:
        admin && admin.telegramGroupInviteLink
          ? admin.telegramGroupInviteLink
          : null,
    };
  } catch (error) {
    console.error("Error fetching admin info:", error);
    return { adminId: null, groupInviteLink: null };
  }
};

// Check if user is admin (for inline keyboard actions)
const checkAdmin = async (ctx) => {
  try {
    const userId = ctx.from.id;
    const adminInfo = await getAdminInfo();
    return (
      adminInfo.adminId && userId.toString() === adminInfo.adminId.toString()
    );
  } catch (error) {
    console.error("Error in admin check:", error);
    return false;
  }
};

// Function to check if a user is a member of the group
const isUserInGroup = async (userId) => {
  try {
    // Check if TELEGRAM_GROUP_ID is set
    if (!process.env.TELEGRAM_GROUP_ID) {
      console.log("TELEGRAM_GROUP_ID not set, skipping group membership check");
      return true; // If not set, assume they're in the group
    }

    // Validate that TELEGRAM_GROUP_ID is a valid number
    if (!/^-?\d+$/.test(process.env.TELEGRAM_GROUP_ID)) {
      console.log(
        "Invalid TELEGRAM_GROUP_ID format, skipping group membership check"
      );
      return true;
    }

    // Get chat member status
    const chatMember = await bot.telegram.getChatMember(
      process.env.TELEGRAM_GROUP_ID,
      userId
    );

    // Check if user is in the group
    // Status can be: 'creator', 'administrator', 'member', 'restricted', 'left', 'kicked'
    const validStatuses = ["creator", "administrator", "member", "restricted"];
    return validStatuses.includes(chatMember.status);
  } catch (error) {
    console.error(`Error checking group membership for user ${userId}:`, error);
    // If there's an error (e.g., user never joined), return false
    // But also handle specific cases like chat not found
    if (error.response && error.response.error_code === 400) {
      console.log(
        "Chat not found or invalid group ID, skipping group membership check"
      );
      return true; // Assume they're in the group if we can't verify
    }
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
  const adminInfo = await getAdminInfo();
  const isAdminUser =
    adminInfo.adminId &&
    ctx.from.id.toString() === adminInfo.adminId.toString();

  if (isAdminUser) {
    // Admin menu with hierarchical navigation
    await ctx.reply(
      `<strong>🛡️ ADMIN DASHBOARD</strong>\n\n` +
        `Welcome, <strong>${user.firstName || user.username}</strong>!\n\n` +
        `<em>You have full administrative privileges.</em>`,
      {
        parse_mode: "HTML",
        ...Markup.inlineKeyboard([
          [Markup.button.callback("📊 Status & Info", "check_status")],
          [Markup.button.callback("👥 User Management", "user_management")],
          [Markup.button.callback("📢 Communications", "communications")],
          [Markup.button.callback("❓ Help & Support", "help")],
          [Markup.button.callback("🚪 Logout", "logout")],
        ]).oneTime(),
      }
    );
  } else {
    // Regular user menu - streamlined for easy use
    const paymentStatus = user.paymentStatus ? "✅ ACTIVE" : "❌ INACTIVE";

    await ctx.reply(
      `<strong>👤 WELCOME ${user.firstName.toUpperCase()}!</strong>\n\n` +
        `💰 <strong>Payment Status:</strong> ${paymentStatus}\n\n` +
        `What would you like to do today?`,
      {
        parse_mode: "HTML",
        ...Markup.inlineKeyboard([
          [Markup.button.callback("🛒 Browse Services", "browse_services")],
          [Markup.button.callback("📊 My Account", "check_status")],
          [Markup.button.callback("❓ Help", "help")],
          [Markup.button.callback("🚪 Logout", "logout")],
        ]).oneTime(),
      }
    );
  }
};

// Command to provide instructions on how to join the group
bot.command("howtojoin", async (ctx) => {
  try {
    const userId = ctx.from.id;

    // Check if this is an admin
    const adminInfo = await getAdminInfo();
    const isAdminUser =
      adminInfo.adminId && userId.toString() === adminInfo.adminId.toString();

    // Check if user is connected
    let user = null;
    if (!isAdminUser) {
      user = await User.findOne({ telegramId: userId });
    } else {
      user = await Admin.findOne({ telegramId: userId });
    }

    if (!user && !isAdminUser) {
      await ctx.reply(
        "ℹ️ You are not yet connected to your SBM Forex Academy account.\n" +
          "Please connect your account first using the /connect command."
      );
      return;
    }

    // Provide group joining instructions
    if (adminInfo.groupInviteLink) {
      // Use HTML formatting instead of Markdown to avoid parsing issues
      await ctx.reply(
        `<b>📢 How to Join Our Telegram Group</b>\n\n` +
          `To receive educational content and broadcasts, please follow these steps:\n\n` +
          `1. Click on this link to join our group: ${adminInfo.groupInviteLink}\n` +
          `2. After joining, you'll automatically start receiving educational content\n` +
          `3. If you've already joined but still see membership issues, try leaving and rejoining the group\n\n` +
          `Once you've joined the group, you'll be able to receive all broadcast messages and educational content.\n\n` +
          `If you continue to experience issues, please contact our support team.`,
        { parse_mode: "HTML" }
      );
    } else {
      await ctx.reply(
        "<b>📢 Group Information</b>\n\n" +
          "Our Telegram group information is not available yet. Please contact support for more details.",
        { parse_mode: "HTML" }
      );
    }

    // Show menu again
    if (user) {
      await showMainMenu(ctx, user);
    }
  } catch (error) {
    console.error("Error in howtojoin command:", error);
    // Send a plain text message as a fallback
    try {
      await ctx.reply(
        "📢 How to Join Our Telegram Group\n\n" +
          "To receive educational content and broadcasts, please follow these steps:\n\n" +
          "1. Click on this link to join our group: Contact admin for the group link\n" +
          "2. After joining, you'll automatically start receiving educational content\n" +
          "3. If you've already joined but still see membership issues, try leaving and rejoining the group\n\n" +
          "Once you've joined the group, you'll be able to receive all broadcast messages and educational content.\n\n" +
          "If you continue to experience issues, please contact our support team."
      );
    } catch (fallbackError) {
      console.error("Fallback error in howtojoin command:", fallbackError);
      await ctx.reply(
        "An error occurred while providing group joining instructions. Please try again later."
      );
    }
  }
});

// Command to connect user account
bot.command("connect", async (ctx) => {
  try {
    const userId = ctx.from.id;

    await ctx.reply(
      `<b>🔗 Account Connection</b>\n\n` +
        `To connect your SBM Forex Academy account with this Telegram bot:\n\n` +
        `1. Visit our website: https://sbmforexacademy.com\n` +
        `2. Log in to your SBM Forex Academy account\n` +
        `3. Go to Account Settings\n` +
        `4. Click "Generate Connection Token"\n` +
        `5. Copy the generated token\n` +
        `6. Send the token to this bot using the command: /token YOUR_TOKEN_HERE\n\n` +
        `Once connected, you'll receive educational content from the group.`,
      { parse_mode: "HTML" }
    );
  } catch (error) {
    console.error("Error in connect command:", error);
    await ctx.reply(
      "An error occurred while providing connection instructions. Please try again later."
    );
  }
});

// Start command - Welcome message with role-based keyboard
bot.start(async (ctx) => {
  try {
    // If this is a group message, redirect to private chat
    if (ctx.chat.type === "group" || ctx.chat.type === "supergroup") {
      await ctx.reply(
        `👋 Hi ${ctx.from.first_name || "there"}!\n\n` +
          `Welcome to SBM Forex Academy! 🚀\n\n` +
          `To access your account and use all features, please start a private conversation with me.\n\n` +
          `Click here to start: [Start Private Chat](https://t.me/${
            process.env.BOT_USERNAME || "SBMforexbot"
          })\n\n` +
          `Available commands: /services, /help`,
        { parse_mode: "Markdown" }
      );
      return;
    }

    const userId = ctx.from.id;

    // Check if this is an admin
    const adminInfo = await getAdminInfo();
    const isAdminUser =
      adminInfo.adminId && userId.toString() === adminInfo.adminId.toString();

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

    // New user - show quick start with video tutorial
    await ctx.reply(
      `🎥 <b>QUICK START GUIDE</b>\n\n` +
        `Welcome to <a href="https://sbmforexacademy.com">SBM Forex Academy</a>! 🚀\n\n` +
        `To get started, you need to connect your account. Watch this short video to learn how:\n\n` +
        `📹 <b>How to Create Your Connection Token:</b>\n` +
        `1. Go to our <a href="https://sbmforexacademy.com">website</a> and log in\n` +
        `2. Navigate to Account Settings\n` +
        `3. Click "Generate Connection Token"\n` +
        `4. Copy the token\n` +
        `5. Send it to this bot\n\n` +
        `<i>💡 Tip: The video shows exactly where to find these options!</i>`,
      {
        parse_mode: "HTML",
        ...Markup.inlineKeyboard([
          [Markup.button.callback("📹 Watch Tutorial Video", "watch_tutorial")],
          [
            Markup.button.callback(
              "🔗 I Have My Token - Connect Now",
              "connect_with_token"
            ),
          ],
          [Markup.button.callback("❓ Need Help?", "help")],
        ]).oneTime(),
      }
    );
  } catch (error) {
    console.error("Error in start command:", error);
    await ctx.reply("An error occurred. Please try again later.");
  }
});

// Handle callback queries (button presses) with proper role checking
bot.action("watch_tutorial", async (ctx) => {
  await ctx.reply(
    `📹 <b>TUTORIAL VIDEO</b>\n\n` +
      `Here's a step-by-step video showing exactly how to create your connection token:\n\n` +
      `🎬 <b>Video Link:</b> <a href="https://sbmforexacademy.com">Watch on our website</a>\n\n` +
      `After watching the video, you'll know exactly how to:\n` +
      `✅ Visit <a href="https://sbmforexacademy.com">SBM Forex Academy</a>\n` +
      `✅ Log into your account\n` +
      `✅ Find Account Settings\n` +
      `✅ Generate your token\n` +
      `✅ Connect to this bot\n\n` +
      `<i>💡 The video is only 2 minutes long and very easy to follow!</i>`,
    {
      parse_mode: "HTML",
      ...Markup.inlineKeyboard([
        [
          Markup.button.callback(
            "🔗 I'm Ready - Connect Now",
            "connect_with_token"
          ),
        ],
        [Markup.button.callback("❓ Still Need Help?", "help")],
      ]).oneTime(),
    }
  );
});

bot.action("connect_with_token", async (ctx) => {
  await ctx.reply(
    `🔗 <b>CONNECT YOUR ACCOUNT</b>\n\n` +
      `Perfect! Now let's connect your account.\n\n` +
      `📝 <b>Send your token like this:</b>\n` +
      `<code>/token YOUR_TOKEN_HERE</code>\n\n` +
      `For example: <code>/token abc123xyz</code>\n\n` +
      `Just copy your token from the website and send it to me!`,
    {
      parse_mode: "HTML",
      ...Markup.inlineKeyboard([
        [Markup.button.callback("❓ Need Help?", "help")],
      ]).oneTime(),
    }
  );
});

bot.action("connect_account", async (ctx) => {
  await ctx.reply(
    `<b>🔗 Account Connection</b>\n\n` +
      `To connect your SBM Forex Academy account with this Telegram bot:\n\n` +
      `1. Visit our website: https://sbmforexacademy.com\n` +
      `2. Log in to your SBM Forex Academy account\n` +
      `3. Go to Account Settings\n` +
      `4. Click "Generate Connection Token"\n` +
      `5. Copy the generated token\n` +
      `6. Send the token to this bot using the command: /token YOUR_TOKEN_HERE\n\n` +
      `Once connected, you'll receive educational content from the group.`,
    { parse_mode: "HTML" }
  );
});

bot.action("how_to_join", async (ctx) => {
  // Create a mock message context to simulate the /howtojoin command
  const mockCtx = {
    ...ctx,
    message: {
      text: "/howtojoin",
      from: ctx.from,
      chat: ctx.chat,
    },
  };

  // Call the howtojoin command handler directly
  await bot.command("howtojoin")(mockCtx);
});

bot.action("check_status", async (ctx) => {
  try {
    const userId = ctx.from.id;

    // Check if this is an admin
    const adminInfo = await getAdminInfo();
    const isAdminUser =
      adminInfo.adminId && userId.toString() === adminInfo.adminId.toString();

    if (isAdminUser) {
      const admin = await Admin.findOne({ role: "admin", telegramId: userId });
      if (admin) {
        await ctx.reply(
          `<b>🛡️ Admin Status</b>\n\n` +
            `Username: ${admin.username}\n` +
            `Email: ${admin.email}\n` +
            `<b>Role: ADMIN</b>\n\n` +
            `You have full administrative privileges.`,
          { parse_mode: "HTML" }
        );
        await showMainMenu(ctx, admin);
        return;
      }
    }

    // Check regular user
    const user = await User.findOne({ telegramId: userId });
    if (!user) {
      await ctx.reply(
        "ℹ️ You are not yet connected to your SBM Forex Academy account.\n" +
          "Use /connect to link your account and receive educational content."
      );
      return;
    }

    // Check if user is in the group
    let groupStatus = "";
    if (adminInfo.groupInviteLink) {
      const isInGroup = await isUserInGroup(userId);
      groupStatus = `\nGroup Membership: ${isInGroup ? "ACTIVE" : "INACTIVE"}`;

      if (!isInGroup) {
        groupStatus +=
          "\n\n📢 Important: You must join our Telegram group to receive educational content and broadcasts. Please join the group to get full access.";
      }
    }

    await ctx.reply(
      `<b>📊 Payment Status</b>\n\n` +
        `Name: ${user.firstName} ${user.lastName}\n` +
        `Email: ${user.email}\n` +
        `<b>Status: ${user.paymentStatus ? "ACTIVE" : "INACTIVE"}</b>` +
        groupStatus +
        "\n\n" +
        (user.paymentStatus &&
        (groupStatus.includes("ACTIVE") || !adminInfo.groupInviteLink)
          ? "✅ You have full access to educational content from the group."
          : "❌ You currently don't have access to educational content. " +
            (user.paymentStatus
              ? "Please join our Telegram group to get access."
              : "Contact admin for assistance.")) +
        "\n",
      { parse_mode: "HTML" }
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
  const adminInfo = await getAdminInfo();
  const isAdminUser =
    adminInfo.adminId && userId.toString() === adminInfo.adminId.toString();

  let message = "<b>🚀 SBM Forex Academy Bot</b>\n\n";

  if (isAdminUser) {
    message += "You are logged in as an Administrator.\n\n";
  } else {
    // Check if regular user is connected
    const user = await User.findOne({ telegramId: userId });
    if (!user) {
      message +=
        "You are not yet connected to your SBM Forex Academy account.\n\n";
      message += "Please use /connect to link your account first.\n\n";
    }
  }

  // General user commands (available to everyone)
  message += "Available commands:\n\n";
  message += "👤 General:\n";
  message += "• /start - Start the bot\n";
  message += "• /token - Connect using a token\n";
  message += "• /help - Show this help message\n";
  message += "• /logout - Logout from your account\n\n";

  // Admin commands (only shown to admins)
  if (isAdminUser) {
    message += "🛡️ Admin Commands:\n";
    message += "• /broadcast - Send message to all paid users\n";
    message += "• /paidmessage - Send paid-only message to group\n";
    message += "• /togglepayment - Toggle user payment status\n\n";
  }

  await ctx.reply(message, { parse_mode: "HTML" });

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
    await ctx.reply(
      `❌ Sorry ${
        ctx.from.first_name || "there"
      }, you don't have permission to perform this action. This feature is only available to administrators.`
    );
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
      await ctx.reply("📪 No users found in the system.");
      return;
    }

    // Create a summary message with user information
    let message = `<b>📋 User Management (${users.length} users)</b>\n\n`;

    // Group users by payment status
    const paidUsers = users.filter((user) => user.paymentStatus);
    const unpaidUsers = users.filter((user) => !user.paymentStatus);

    message += `<b>✅ Paid Users (${paidUsers.length}):</b>\n`;
    paidUsers.forEach((user) => {
      message += `• ${user.firstName} ${user.lastName} (${user.email}) ${
        user.telegramId ? "(Connected)" : "(Not Connected)"
      }\n`;
    });

    message += `\n<b>❌ Not Paid Users (${unpaidUsers.length}):</b>\n`;
    unpaidUsers.forEach((user) => {
      message += `• ${user.firstName} ${user.lastName} (${user.email}) ${
        user.telegramId ? "(Connected)" : "(Not Connected)"
      }\n`;
    });

    await ctx.reply(message, { parse_mode: "HTML" });

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
    await ctx.reply(
      `❌ Sorry ${
        ctx.from.first_name || "there"
      }, you don't have permission to perform this action. This feature is only available to administrators.`
    );
    // Show regular user menu
    const userId = ctx.from.id;
    const user = await User.findOne({ telegramId: userId });
    if (user) {
      await showMainMenu(ctx, user);
    }
    return;
  }

  await ctx.reply(
    "<b>📢 Broadcast Message</b>\n\n" +
      "To broadcast a message to all paying users, use the command:\n" +
      "/broadcast Your message here",
    { parse_mode: "HTML" }
  );
});

bot.action("toggle_payment", async (ctx) => {
  // Check if user is admin
  const isAdminUser = await checkAdmin(ctx);

  if (!isAdminUser) {
    await ctx.reply(
      `❌ Sorry ${
        ctx.from.first_name || "there"
      }, you don't have permission to perform this action. This feature is only available to administrators.`
    );
    // Show regular user menu
    const userId = ctx.from.id;
    const user = await User.findOne({ telegramId: userId });
    if (user) {
      await showMainMenu(ctx, user);
    }
    return;
  }

  await ctx.reply(
    "<b>🔄 Toggle Payment Status</b>\n\n" +
      "To toggle a user's payment status, use the command:\n" +
      "/togglepayment [payment_id]",
    { parse_mode: "HTML" }
  );
});

// Command to connect user account
bot.command("connect", async (ctx) => {
  try {
    const userId = ctx.from.id;

    await ctx.reply(
      `<b>🔗 Account Connection</b>\n\n` +
        `To connect your SBM Forex Academy account with this Telegram bot:\n\n` +
        `1. Log in to your SBM Forex Academy account on the website\n` +
        `2. Go to Account Settings\n` +
        `3. Click "Generate Connection Token"\n` +
        `4. Copy the generated token\n` +
        `5. Send the token to this bot using the command: /token YOUR_TOKEN_HERE\n\n` +
        `Once connected, you'll receive educational content from the group.`,
      { parse_mode: "HTML" }
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
        "❌ Please provide a connection token.\n\n" +
          "Usage: /token YOUR_TOKEN_HERE\n\n" +
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
        "❌ This Telegram account is already connected to an account.\n\n" +
          "Please logout first using the /logout command before connecting a new account."
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
        const adminInfo = await getAdminInfo();
        const isAdminUser =
          adminInfo.adminId &&
          userId.toString() === adminInfo.adminId.toString();

        if (isAdminUser) {
          // Additional verification for admin users
          const adminVerification = await verifyAdminConnection(userId, token);
          if (!adminVerification.isValid) {
            await ctx.reply(
              `<b>❌ Admin Verification Failed</b>\n\n` +
                `${adminVerification.message}\n\n` +
                `Please ensure you've set your Telegram ID in the admin dashboard and try again.`
            );
            return;
          }

          await ctx.reply(
            "<b>✅ Admin Connection Successful</b>\n\n" +
              "Welcome Admin! Your Telegram account is now connected.\n\n" +
              "You have full administrative privileges.",
            { parse_mode: "HTML" }
          );

          // Show admin menu
          await showMainMenu(ctx, adminVerification.admin);
        } else {
          // For regular users, check if they need to join the group
          let groupMessage = "";
          if (adminInfo.groupInviteLink) {
            // Check if user is in the group
            const isInGroup = await isUserInGroup(userId);

            if (!isInGroup) {
              groupMessage =
                "\n\n📢 Important Notice: You must join our Telegram group to receive educational content and broadcasts. " +
                "Please join the group now to get full access to our services.\n\n" +
                "Use /howtojoin to get instructions on how to join our group.";
            } else {
              groupMessage =
                "\n\n✅ You are already a member of our Telegram group. You will receive educational content and broadcasts.";
            }
          }

          await ctx.reply(
            "<b>✅ Connection Successful</b>\n\n" +
              "Welcome " +
              result.data.firstName +
              "! Your Telegram account is now connected.\n\n" +
              "<b>Payment Status: " +
              (result.data.paymentStatus ? "ACTIVE" : "INACTIVE") +
              "</b>\n" +
              (result.data.paymentStatus
                ? "You will now receive educational content from the group (if you're a group member)."
                : "You will not receive educational content until your payment status is active.") +
              groupMessage,
            { parse_mode: "HTML" }
          );

          // Show the appropriate menu based on user role
          const user = await User.findOne({ telegramId: userId });
          if (user) {
            await showMainMenu(ctx, user);
          }
        }
      } else {
        await ctx.reply(
          "<b>❌ Connection Failed</b>\n\n" +
            result.message +
            "\n\n" +
            "Please generate a new token and try again.",
          { parse_mode: "HTML" }
        );
      }
    } catch (apiError) {
      console.error("Error calling validation API:", apiError);
      await ctx.reply(
        "<b>❌ Connection Failed</b>\n\n" +
          "An error occurred while validating your token. Please try again later.",
        { parse_mode: "HTML" }
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

// Upload receipt command
bot.command("uploadreceipt", async (ctx) => {
  try {
    const userId = ctx.from.id;

    // Check if user is connected
    let user = await User.findOne({ telegramId: userId });
    const adminUser = await Admin.findOne({ telegramId: userId });

    if (!user && !adminUser) {
      await ctx.reply(
        "❌ You need to connect your account first before uploading receipts.\n\n" +
          "Please use /connect to link your account."
      );
      return;
    }

    if (!user && adminUser) {
      user = adminUser;
    }

    await ctx.reply(
      `<strong>📤 UPLOAD PAYMENT RECEIPT</strong>\n\n` +
        `Please upload an image of your payment receipt for processing.\n\n` +
        `Supported formats: JPG, PNG, GIF\n` +
        `Maximum size: 5MB\n\n` +
        `After uploading, you'll receive confirmation that your payment is being processed, and our admin team will review your receipt.`,
      {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{ text: "◀️ Back to Main Menu", callback_data: "main_menu" }],
          ],
        },
      }
    );
  } catch (error) {
    console.error("Error in uploadreceipt command:", error);
    await ctx.reply(
      "❌ An error occurred while preparing for receipt upload. Please try again later."
    );
  }
});

// Help command
bot.help(async (ctx) => {
  const userId = ctx.from.id;

  // Check if this is an admin
  const adminInfo = await getAdminInfo();
  const isAdminUser =
    adminInfo.adminId && userId.toString() === adminInfo.adminId.toString();

  let message = "<b>🚀 SBM Forex Academy Bot</b>\n\n";

  if (isAdminUser) {
    message += "You are logged in as an Administrator.\n\n";
  } else {
    // Check if regular user is connected
    const user = await User.findOne({ telegramId: userId });
    if (!user) {
      message +=
        "You are not yet connected to your SBM Forex Academy account.\n\n";
      message += "Please use /connect to link your account first.\n\n";
    }
  }

  // General user commands (available to everyone)
  message += "Available commands:\n\n";
  message += "👤 General:\n";
  message += "• /start - Start the bot\n";
  message += "• /token - Connect using a token\n";
  message += "• /help - Show this help message\n";
  message += "• /logout - Logout from your account\n\n";
  // Admin commands (only shown to admins)
  if (isAdminUser) {
    message += "🛡️ Admin Commands:\n";
    message += "• /broadcast - Send message to all paid users\n";
    message += "• /paidmessage - Send paid-only message to group\n";
    message += "• /togglepayment - Toggle user payment status\n\n";
  }

  await ctx.reply(message, { parse_mode: "HTML" });

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
    const adminInfo = await getAdminInfo();

    // Check if this user ID matches the admin ID in the database
    if (
      adminInfo.adminId &&
      userId.toString() === adminInfo.adminId.toString()
    ) {
      return next();
    }

    await ctx.reply(
      `❌ Sorry ${
        ctx.from.first_name || "there"
      }, you don't have permission to perform this action. Admin access required.`
    );
  } catch (error) {
    console.error("Error in admin check:", error);
    await ctx.reply("An error occurred while verifying your admin status.");
  }
};

// Admin-only command to toggle user payment status
bot.command("togglepayment", isAdminMiddleware, async (ctx) => {
  try {
    // Expect a payment ID as argument
    const args = ctx.message.text.split(" ");

    if (args.length < 2) {
      await ctx.reply(
        "❌ Please provide a payment ID. Usage: /togglepayment [payment_id]"
      );
      return;
    }

  const paymentId = args[1].trim();

    // Validate paymentId is a valid ObjectId
    if (!paymentId || !mongoose.isValidObjectId(paymentId)) {
      await ctx.reply(
        "❌ The provided payment ID is invalid. Please provide a valid payment ID. Usage: /togglepayment [payment_id]"
      );
      return;
    }

    // Find the payment by ID
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      await ctx.reply(
        "❌ Payment with ID " + paymentId + " not found in our system."
      );
      return;
    }

    // Find the user associated with the payment
    const user = await User.findById(payment.userId);
    if (!user) {
      await ctx.reply(
        "❌ User associated with this payment not found in our system."
      );
      return;
    }

    // Toggle payment.status between 'pending' and 'completed'
    const oldPaymentStatus = payment.status;
    if (payment.status === "completed") {
      payment.status = "pending";
      payment.processedBy = null;
      payment.processedAt = null;
    } else {
      payment.status = "completed";
      // Try to set processedBy to admin DB _id if available
      const adminRecord = await Admin.findOne({ telegramId: ctx.from.id });
      payment.processedBy = adminRecord ? adminRecord._id : ctx.from.id;
      payment.processedAt = new Date();
    }

    await payment.save();

    // Update user's paymentStatus to reflect whether there is any completed payment
    // If payment is completed, set user.paymentStatus = true, otherwise check if user has other completed payments
    if (payment.status === "completed") {
      user.paymentStatus = true;
      await user.save();
    } else {
      // Check if user has any other completed payments
      const hasOtherCompleted = await Payment.exists({
        userId: user._id,
        status: "completed",
        _id: { $ne: payment._id },
      });
      user.paymentStatus = !!hasOtherCompleted;
      await user.save();
    }

    await ctx.reply(
      `<b>✅ Payment ${payment._id} status updated</b>\n` +
        `<b>Old payment status:</b> ${oldPaymentStatus}\n` +
        `<b>New payment status:</b> ${payment.status}\n` +
        `<b>User:</b> ${user.firstName} ${user.lastName} (${user.email})\n` +
        `<b>User paymentStatus:</b> ${user.paymentStatus ? "ACTIVE" : "INACTIVE"}`,
      { parse_mode: "HTML" }
    );

    // Notify the user if connected
    if (user.telegramId) {
      try {
        await bot.telegram.sendMessage(
          user.telegramId,
          `<b>🔔 Payment Update</b>\n\n` +
            `Your payment (ID: ${payment._id}) status has been changed to <b>${payment.status}</b>.\n` +
            `Your access is now <b>${user.paymentStatus ? "ACTIVE" : "INACTIVE"}</b>.`,
          { parse_mode: "HTML" }
        );
      } catch (notifyError) {
        console.error("Failed to notify user about payment toggle:", notifyError);
      }
    }

    // If the payment was activated, send confirmation email
    if (payment.status === "completed" && oldPaymentStatus !== "completed") {
      try {
        const { sendPaymentConfirmationEmail } = await import(
          "../config/email.js"
        );
        await sendPaymentConfirmationEmail(user, payment.service);
      } catch (emailError) {
        console.error("Failed to send payment confirmation email:", emailError);
      }
    }
  } catch (error) {
    console.error("Error in togglepayment command:", error);
    await ctx.reply(
      "An error occurred while updating the payment status. Please try again later."
    );
  }
});

// Function to check if a user should receive messages
const canReceiveMessages = async (userId) => {
  try {
    const user = await User.findOne({ telegramId: userId });

    // Check if user exists and has payment status
    if (!user || !user.paymentStatus) {
      return false;
    }

    // If group ID is set, check if user is in the group
    if (process.env.TELEGRAM_GROUP_ID) {
      const isInGroup = await isUserInGroup(userId);
      return isInGroup;
    }

    // If no group ID is set, just check payment status
    return true;
  } catch (error) {
    console.error("Error checking if user can receive messages:", error);
    // In case of error, we'll be conservative and assume they can't receive messages
    return false;
  }
};

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
    let notInGroupCount = 0;

    // Get admin info for group invite link
    const adminInfo = await getAdminInfo();

    // Send message to each paying user
    for (const user of payingUsers) {
      try {
        // Check if user is in the Telegram group
        const isInGroup = await isUserInGroup(user.telegramId);

        if (!isInGroup) {
          console.log(
            `User ${user.email} is not in the group, skipping broadcast`
          );
          notInGroupCount++;
          // Send a notification to the user that they need to join the group
          try {
            await bot.telegram.sendMessage(
              user.telegramId,
              `<b>📢 Broadcast Notice</b>\n\n` +
                `We tried to send you a broadcast message, but you're not currently a member of our Telegram group.\n\n` +
                `Please join our group to receive educational content and broadcasts. After joining, you'll start receiving messages again.\n\n` +
                `Use /howtojoin to get instructions on how to join our group.`,
              { parse_mode: "HTML" }
            );
          } catch (notifyError) {
            console.error(
              `Failed to notify user ${user.telegramId} about group membership:`,
              notifyError
            );
          }
          continue;
        }

        await bot.telegram.sendMessage(
          user.telegramId,
          `<b>📢 Broadcast Message</b>\n\n${message}`,
          { parse_mode: "HTML" }
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

    // Send broadcast summary to admin privately (not in group)
    await bot.telegram.sendMessage(
      ctx.from.id,
      `<b>📬 Broadcast Summary</b>\n\n` +
        `Total paying users: ${payingUsers.length}\n` +
        `Successfully delivered: ${successCount}\n` +
        `Not in group: ${notInGroupCount}\n` +
        `Failed deliveries: ${failureCount}\n\n` +
        (notInGroupCount > 0
          ? `${notInGroupCount} users were notified that they need to join the group to receive broadcasts.\n\n`
          : "") +
        (failureCount > 0
          ? "Some users may have blocked the bot or deleted their account."
          : ""),
      { parse_mode: "HTML" }
    );
  } catch (error) {
    console.error("Error in broadcast command:", error);
    await bot.telegram.sendMessage(
      ctx.from.id,
      "An error occurred while sending the broadcast message. Please try again later."
    );
  }
});

// Admin-only command to send paid-only message to group
bot.command("paidmessage", isAdminMiddleware, async (ctx) => {
  try {
    // Delete the command message immediately so users don't see it
    try {
      await ctx.deleteMessage();
    } catch (error) {
      console.error("Failed to delete message:", error);
    }

    // Get the message text
    const message = ctx.message.text;

    if (!message) {
      await ctx.reply(
        "❌ Please provide a message to send. Usage: /paidmessage [your message]"
      );
      return;
    }

    // Get admin info for group invite link
    const adminInfo = await getAdminInfo();

    // If group invite link is not set, inform admin and exit
    if (!adminInfo.groupInviteLink) {
      await ctx.reply(
        "❌ Group invite link is not set in the admin dashboard. Please set the group invite link first."
      );
      return;
    }

    // Send the message to the group
    try {
      await bot.telegram.sendMessage(
        adminInfo.groupInviteLink,
        `<b>📢 Paid Message</b>\n\n${message}`,
        { parse_mode: "HTML" }
      );

      await ctx.reply(
        "<b>✅ Paid Message Sent to Group</b>\n\n" +
          "The message has been sent to all members of the group.",
        { parse_mode: "HTML" }
      );
    } catch (error) {
      console.error(
        "Failed to send paid message to the group:",
        error.response ? error.response.description : error.message
      );

      // Handle specific cases like chat not found or message is not modified
      if (
        error.response &&
        (error.response.error_code === 400 ||
          error.response.error_code === 422 ||
          error.response.error_code === 403)
      ) {
        await ctx.reply(
          "❌ Failed to send the paid message to the group.\n\n" +
            "Please ensure the group invite link is correct and you have permissions to send messages there.",
          { parse_mode: "HTML" }
        );
      } else {
        await ctx.reply(
          "❌ An error occurred while sending the paid message to the group. Please try again later.",
          { parse_mode: "HTML" }
        );
      }
    }
  } catch (error) {
    console.error("Error in paidmessage command:", error);
    await ctx.reply(
      "An error occurred while sending the paid message to the group. Please try again later."
    );
  }
});

// Listen for new text messages in the group
bot.on("text", async (ctx) => {
  try {
    // Only process text messages, not photos or other media
    if (!ctx.message || !ctx.message.text) {
      return;
    }

    // Only process messages from groups, not private chats
    if (ctx.chat.type !== "group" && ctx.chat.type !== "supergroup") {
      return;
    }

    // Commands in groups are now handled by middleware above

    // Get admin info
    const adminInfo = await getAdminInfo();

    // Check if the message is from the designated group
    if (
      adminInfo.groupInviteLink &&
      ctx.chat.id.toString() === process.env.TELEGRAM_GROUP_ID
    ) {
      // Get the message sender's information
      const senderId = ctx.message.from.id;

      // Only allow admins to post messages that get forwarded
      if (
        !adminInfo.adminId ||
        senderId.toString() !== adminInfo.adminId.toString()
      ) {
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

      // Get all paying users with connected Telegram accounts who are in the group
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
      let notInGroupCount = 0;

      // Forward the message to each paying user
      for (const user of payingUsers) {
        try {
          // Check if user can receive messages (payment status + group membership)
          const canReceive = await canReceiveMessages(user.telegramId);

          if (!canReceive) {
            // Check specifically if it's a group membership issue
            const isInGroup = process.env.TELEGRAM_GROUP_ID
              ? await isUserInGroup(user.telegramId)
              : true;

            if (process.env.TELEGRAM_GROUP_ID && !isInGroup) {
              console.log(
                `User ${user.email} is not in the group, skipping message forwarding`
              );
              notInGroupCount++;
              // Send a notification to the user that they need to join the group
              try {
                await bot.telegram.sendMessage(
                  user.telegramId,
                  `<b>📢 Message Forwarding Notice</b>\n\n` +
                    `We tried to forward a group message to you, but you're not currently a member of our Telegram group.\n\n` +
                    `Please join our group to receive educational content. After joining, you'll start receiving messages again.\n\n` +
                    `Use /howtojoin to get instructions on how to join our group.`,
                  { parse_mode: "HTML" }
                );
              } catch (notifyError) {
                console.error(
                  `Failed to notify user ${user.telegramId} about group membership:`,
                  notifyError
                );
              }
            }
            continue;
          }

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
          `<b>📬 Message Distribution Summary</b>\n\n` +
            `Total paying users: ${payingUsers.length}\n` +
            `Successfully delivered: ${successCount}\n` +
            `Not in group: ${notInGroupCount}\n` +
            `Failed deliveries: ${failureCount}\n\n` +
            (notInGroupCount > 0
              ? `${notInGroupCount} users were notified that they need to join the group to receive messages.\n\n`
              : "") +
            (failureCount > 0
              ? "Some users may have blocked the bot or deleted their account."
              : ""),
          { parse_mode: "HTML" }
        );
      } catch (error) {
        console.error("Failed to send distribution summary:", error);
      }
    }
  } catch (error) {
    console.error("Error in message forwarding:", error);
  }
});

// Admin User Management Menu
bot.action("user_management", async (ctx) => {
  // Check if user is admin
  const isAdminUser = await checkAdmin(ctx);

  if (!isAdminUser) {
    await ctx.reply(
      `❌ Sorry ${
        ctx.from.first_name || "there"
      }, you don't have permission to perform this action. This feature is only available to administrators.`
    );
    return;
  }

  await ctx.reply(
    `<strong>👥 USER MANAGEMENT</strong>\n\n` +
      `Manage user accounts and permissions.`,
    {
      parse_mode: "HTML",
      ...Markup.inlineKeyboard([
        [Markup.button.callback("📋 View All Users", "manage_users")],
        [Markup.button.callback("🔄 Toggle Payment Status", "toggle_payment")],
        [Markup.button.callback("◀️ Back to Main Menu", "main_menu")],
      ]).oneTime(),
    }
  );
});

// Admin Communications Menu
bot.action("communications", async (ctx) => {
  // Check if user is admin
  const isAdminUser = await checkAdmin(ctx);

  if (!isAdminUser) {
    await ctx.reply(
      `❌ Sorry ${
        ctx.from.first_name || "there"
      }, you don't have permission to perform this action. This feature is only available to administrators.`
    );
    return;
  }

  await ctx.reply(
    `<strong>📢 COMMUNICATIONS</strong>\n\n` +
      `Send messages and manage communications.`,
    {
      parse_mode: "HTML",
      ...Markup.inlineKeyboard([
        [Markup.button.callback("📬 Broadcast Message", "broadcast")],
        [Markup.button.callback("togroup", "togroup")],
        [Markup.button.callback("◀️ Back to Main Menu", "main_menu")],
      ]).oneTime(),
    }
  );
});

// User Services & Payments Menu
bot.action("services_info", async (ctx) => {
  await ctx.reply(
    `<strong>💳 SERVICES & PAYMENTS</strong>\n\n` +
      `View available services and payment options.`,
    {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "📚 Service Details", callback_data: "view_services" }],
          [{ text: "💰 Payment Options", callback_data: "payment_info" }],
          [{ text: "◀️ Back to Main Menu", callback_data: "main_menu" }],
        ],
      },
    }
  );
});

// Payment Information
bot.action("payment_info", async (ctx) => {
  await ctx.reply(
    `<strong>💰 PAYMENT OPTIONS</strong>\n` +
      `<em>Bank transfer is our only accepted payment method</em>\n\n` +
      `<u>Bank Transfer:</u>\n` +
      `<strong>Account Name:</strong> <code>Emmanuel Chidiebere</code>\n` +
      `<strong>Account Number:</strong> <code>6162598082</code>\n` +
      `<strong>Bank:</strong> <em>Fidelity Bank</em>\n\n` +
      `<u>After payment:</u>\n` +
      `<strong>Send proof to WhatsApp:</strong>\n` +
      `<a href="https://wa.me/2349032085666">Click here to chat</a>\n\n` +
      `<em>For more information, contact support.</em>`,
    {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "◀️ Back", callback_data: "services_info" }],
        ],
      },
    }
  );
});

// Back to Main Menu
bot.action("main_menu", async (ctx) => {
  const userId = ctx.from.id;

  // Check if this is an admin
  const adminInfo = await getAdminInfo();
  const isAdminUser =
    adminInfo.adminId && userId.toString() === adminInfo.adminId.toString();

  if (isAdminUser) {
    const admin = await Admin.findOne({ role: "admin", telegramId: userId });
    if (admin) {
      await showMainMenu(ctx, admin);
    }
  } else {
    const user = await User.findOne({ telegramId: userId });
    if (user) {
      await showMainMenu(ctx, user);
    }
  }
});

// Handle any text messages that aren't commands
bot.on("text", async (ctx) => {
  try {
    const userId = ctx.from.id;
    const user = await User.findOne({ telegramId: userId });

    // If user is not connected, guide them to connect
    if (!user) {
      await ctx.reply(
        `👋 Hi ${ctx.from.first_name || "there"}!\n\n` +
          `Welcome to SBM Forex Academy! 🚀\n\n` +
          `It looks like you haven't connected your account yet.\n\n` +
          `Let's get you started:`,
        Markup.inlineKeyboard([
          [
            Markup.button.callback(
              "🎥 Watch Tutorial & Connect",
              "watch_tutorial"
            ),
          ],
          [
            Markup.button.callback(
              "🔗 I Have Token - Connect Now",
              "connect_with_token"
            ),
          ],
          [Markup.button.callback("❓ Need Help?", "help")],
        ])
      );
      return;
    }

    // If user is connected but sent random text, show helpful menu
    await ctx.reply(
      `👋 Hi ${user.firstName}!\n\n` + `What would you like to do?`,
      Markup.inlineKeyboard([
        [Markup.button.callback("🛒 Browse Services", "browse_services")],
        [Markup.button.callback("📊 My Account", "check_status")],
        [Markup.button.callback("❓ Help", "help")],
      ])
    );
  } catch (error) {
    console.error("Error in text handler:", error);
  }
});

// View Services Details
bot.action("view_services", async (ctx) => {
  // Instead of trying to call the command directly, we'll recreate the functionality
  try {
    const userId = ctx.from.id;

    // Check if user is connected
    let user = await User.findOne({ telegramId: userId });
    const admin = await Admin.findOne({ telegramId: userId });

    // If not a regular user, check if it's an admin
    if (!user && admin) {
      user = admin;
    }

    let message =
      `<strong>💳 SBM FOREX ACADEMY SERVICES</strong>\n` +
      `<em>Comprehensive trading solutions for all skill levels</em>\n\n`;

    if (!user) {
      message +=
        `⚠️ <strong>Account Not Connected</strong>\n` +
        `Please <u>connect your account</u> using /connect to access personalized services.\n\n`;
    }

    // Account Management Services (keeping this)
    message +=
      `<strong>💼 ACCOUNT MANAGEMENT</strong>\n` +
      `<em>Professional management for consistent profits</em>\n\n` +
      `<u>1. Basic Account Management</u>\n` +
      `<strong>Price:</strong> $500/month\n` +
      `• Professional account setup and configuration\n` +
      `• Regular market analysis and trading signals\n` +
      `• Basic risk management and position sizing\n\n` +
      `<u>2. Advanced Account Management</u>\n` +
      `<strong>Price:</strong> $1000 - $5000/month\n` +
      `• All Basic package benefits\n` +
      `• Customized trading strategies and plans\n` +
      `• Advanced risk management and portfolio optimization\n` +
      `• Regular performance analysis and reporting\n\n` +
      `<u>3. Premium Account Management</u>\n` +
      `<strong>Price:</strong> $5000 - $10000/month\n` +
      `• All Advanced package benefits\n` +
      `• Personalized trading coach and dedicated manager\n` +
      `• Advanced technical analysis and market research\n` +
      `• High-net-worth account management\n\n`;

    // Signal Provision Service (keeping this)
    message +=
      `<strong>📈 SIGNAL PROVISION</strong>\n` +
      `<em>Accurate signals for informed trading decisions</em>\n\n` +
      `<u>Forex Trading Signals Service</u>\n` +
      `<strong>Price:</strong> $80/month\n` +
      `• Accurate and timely trading signals\n` +
      `• Expert analysis and market insights\n` +
      `• Trade entry and exit strategies\n\n`;

    // Payment Information
    message +=
      `<strong>💰 PAYMENT OPTIONS</strong>\n` +
      `<em>Bank transfer is our only accepted payment method</em>\n\n` +
      `<u>Bank Transfer:</u>\n` +
      `<strong>Account Name:</strong> <code>Emmanuel Chidiebere</code>\n` +
      `<strong>Account Number:</strong> <code>6162598082</code>\n` +
      `<strong>Bank:</strong> <em>Fidelity Bank</em>\n\n` +
      `<u>After payment:</u>\n` +
      `<strong>Send proof to WhatsApp:</strong>\n` +
      `<a href="https://wa.me/2349032085666">Click here to chat</a>\n\n` +
      `<em>For more information, visit our website or contact support.</em>`;

    await ctx.reply(message, { parse_mode: "HTML" });

    // Show menu again if user is connected
    if (user) {
      await ctx.reply(`<strong>Need more information?</strong>`, {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{ text: "💳 Payment Options", callback_data: "payment_info" }],
            [{ text: "◀️ Back to Main Menu", callback_data: "main_menu" }],
          ],
        },
      });
    }
  } catch (error) {
    console.error("Error in view_services action:", error);
    await ctx.reply(
      "An error occurred while fetching service information. Please try again later."
    );
  }
});

// Command to display services and payment information
console.log("Registering /payment command");
bot.command("payment", async (ctx) => {
  try {
    console.log("Payment command triggered by user:", ctx.from.id);
    const userId = ctx.from.id;

    // Check if user is connected
    let user = await User.findOne({ telegramId: userId });
    const admin = await Admin.findOne({ telegramId: userId });

    // If not a regular user, check if it's an admin
    if (!user && admin) {
      user = admin;
    }

    let message =
      `<strong>💰 PAYMENT OPTIONS</strong>\n` +
      `<em>Bank transfer is our only accepted payment method</em>\n\n` +
      `<u>Bank Transfer:</u>\n` +
      `<strong>Account Name:</strong> <code>Emmanuel Chidiebere</code>\n` +
      `<strong>Account Number:</strong> <code>6162598082</code>\n` +
      `<strong>Bank:</strong> <em>Fidelity Bank</em>\n\n` +
      `<u>After payment:</u>\n` +
      `<strong>Send proof to WhatsApp:</strong>\n` +
      `<a href="https://wa.me/2349032085666">Click here to chat</a>\n\n` +
      `<em>For more information, contact support.</em>`;

    console.log("Sending payment message to user:", userId);
    await ctx.reply(message, { parse_mode: "HTML" });

    // Show menu again if user is connected
    if (user) {
      await ctx.reply(`<strong>Need more information?</strong>`, {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{ text: "◀️ Back to Main Menu", callback_data: "main_menu" }],
          ],
        },
      });
    }
  } catch (error) {
    console.error("Error in payment command:", error);
    await ctx.reply(
      "An error occurred while fetching payment information. Please try again later."
    );
  }
});

// Browse Services - streamlined service selection
bot.action("browse_services", async (ctx) => {
  try {
    const userId = ctx.from.id;
    const user = await User.findOne({ telegramId: userId });

    if (!user) {
      await ctx.reply("❌ Please connect your account first using /start");
      return;
    }

    await ctx.reply(
      `🛒 <b>CHOOSE YOUR SERVICE</b>\n\n` +
        `Select the service you want to subscribe to:\n\n` +
        `💼 <b>Account Management Services</b>\n` +
        `📈 <b>Signal Services</b>\n\n` +
        `<i>Click on any service to see details and pricing!</i>`,
      {
        parse_mode: "HTML",
        ...Markup.inlineKeyboard([
          [
            Markup.button.callback(
              "💼 Account Management",
              "account_management_services"
            ),
          ],
          [Markup.button.callback("📈 Trading Signals", "signal_services")],
          [Markup.button.callback("◀️ Back to Menu", "main_menu")],
        ]).oneTime(),
      }
    );
  } catch (error) {
    console.error("Error in browse_services:", error);
    await ctx.reply("An error occurred. Please try again later.");
  }
});

// Account Management Services
bot.action("account_management_services", async (ctx) => {
  try {
    const userId = ctx.from.id;
    const user = await User.findOne({ telegramId: userId });

    if (!user) {
      await ctx.reply("❌ Please connect your account first using /start");
      return;
    }

    await ctx.reply(
      `💼 <b>ACCOUNT MANAGEMENT SERVICES</b>\n\n` +
        `Choose your preferred management level:\n\n` +
        `🟢 <b>Basic Management</b>\n` +
        `💰 <b>Price:</b> $500/month\n` +
        `• Professional setup\n` +
        `• Regular signals\n` +
        `• Basic risk management\n\n` +
        `🟡 <b>Advanced Management</b>\n` +
        `💰 <b>Price:</b> $1000-$5000/month\n` +
        `• All Basic benefits\n` +
        `• Custom strategies\n` +
        `• Advanced risk management\n\n` +
        `🔴 <b>Premium Management</b>\n` +
        `💰 <b>Price:</b> $5000-$10000/month\n` +
        `• All Advanced benefits\n` +
        `• Personal coach\n` +
        `• High-net-worth management`,
      {
        parse_mode: "HTML",
        ...Markup.inlineKeyboard([
          [
            Markup.button.callback(
              "🟢 Choose Basic ($500/month)",
              "select_service_basic"
            ),
          ],
          [
            Markup.button.callback(
              "🟡 Choose Advanced ($1000-$5000/month)",
              "select_service_advanced"
            ),
          ],
          [
            Markup.button.callback(
              "🔴 Choose Premium ($5000-$10000/month)",
              "select_service_premium"
            ),
          ],
          [Markup.button.callback("◀️ Back to Services", "browse_services")],
        ]).oneTime(),
      }
    );
  } catch (error) {
    console.error("Error in account_management_services:", error);
    await ctx.reply("An error occurred. Please try again later.");
  }
});

// Signal Services
bot.action("signal_services", async (ctx) => {
  try {
    const userId = ctx.from.id;
    const user = await User.findOne({ telegramId: userId });

    if (!user) {
      await ctx.reply("❌ Please connect your account first using /start");
      return;
    }

    await ctx.reply(
      `📈 <b>TRADING SIGNALS SERVICE</b>\n\n` +
        `💰 <b>Price:</b> $80/month\n\n` +
        `✅ <b>What you get:</b>\n` +
        `• Accurate trading signals\n` +
        `• Expert market analysis\n` +
        `• Entry and exit strategies\n` +
        `• Real-time notifications\n` +
        `• 24/7 support\n\n` +
        `<i>Perfect for traders who want professional guidance!</i>`,
      {
        parse_mode: "HTML",
        ...Markup.inlineKeyboard([
          [
            Markup.button.callback(
              "📈 Subscribe to Signals ($80/month)",
              "select_service_signals"
            ),
          ],
          [Markup.button.callback("◀️ Back to Services", "browse_services")],
        ]).oneTime(),
      }
    );
  } catch (error) {
    console.error("Error in signal_services:", error);
    await ctx.reply("An error occurred. Please try again later.");
  }
});

// Service selection handlers
bot.action("select_service_basic", async (ctx) => {
  // Store selected service in user's session
  ctx.session = ctx.session || {};
  ctx.session.selectedService = {
    name: "Basic Account Management",
    price: 500,
    currency: "USD",
    description:
      "Professional account setup and configuration with regular market analysis and trading signals",
  };
  await showPaymentInstructions(ctx, "Basic Account Management", "$500/month");
});

bot.action("select_service_advanced", async (ctx) => {
  // Store selected service in user's session
  ctx.session = ctx.session || {};
  ctx.session.selectedService = {
    name: "Advanced Account Management",
    price: 2500, // Mid-range price for $1000-$5000 range
    currency: "USD",
    description:
      "All Basic package benefits with customized trading strategies and advanced risk management",
  };
  await showPaymentInstructions(
    ctx,
    "Advanced Account Management",
    "$1000-$5000/month"
  );
});

bot.action("select_service_premium", async (ctx) => {
  // Store selected service in user's session
  ctx.session = ctx.session || {};
  ctx.session.selectedService = {
    name: "Premium Account Management",
    price: 7500, // Mid-range price for $5000-$10000 range
    currency: "USD",
    description:
      "All Advanced package benefits with personalized trading coach and dedicated manager",
  };
  await showPaymentInstructions(
    ctx,
    "Premium Account Management",
    "$5000-$10000/month"
  );
});

bot.action("select_service_signals", async (ctx) => {
  // Store selected service in user's session
  ctx.session = ctx.session || {};
  ctx.session.selectedService = {
    name: "Trading Signals Service",
    price: 80,
    currency: "USD",
    description:
      "Accurate and timely trading signals with expert analysis and market insights",
  };
  await showPaymentInstructions(ctx, "Trading Signals Service", "$80/month");
});

// Show payment instructions
const showPaymentInstructions = async (ctx, serviceName, price) => {
  try {
    await ctx.reply(
      `💳 <b>PAYMENT INSTRUCTIONS</b>\n\n` +
        `🎯 <b>Service:</b> ${serviceName}\n` +
        `💰 <b>Price:</b> ${price}\n\n` +
        `📝 <b>How to Pay:</b>\n` +
        `1. Transfer the amount to our bank account\n` +
        `2. Take a screenshot of your payment receipt\n` +
        `3. Send the receipt image to this bot\n` +
        `4. We'll activate your service within 24 hours\n\n` +
        `🏦 <b>Bank Details:</b>\n` +
        `<strong>Account Name:</strong> Emmanuel Chidiebere\n` +
        `<strong>Account Number:</strong> 6162598082\n` +
        `<strong>Bank:</strong> Fidelity Bank\n\n` +
        `<i>💡 After payment, just send your receipt as an image to this bot!</i>`,
      {
        parse_mode: "HTML",
        ...Markup.inlineKeyboard([
          [
            Markup.button.callback(
              "✅ I've Made Payment - Send Receipt",
              "send_receipt"
            ),
          ],
          [Markup.button.callback("❓ Need Help?", "help")],
          [Markup.button.callback("◀️ Back to Services", "browse_services")],
        ]).oneTime(),
      }
    );
  } catch (error) {
    console.error("Error in showPaymentInstructions:", error);
    await ctx.reply("An error occurred. Please try again later.");
  }
};

// Handle receipt sending
bot.action("send_receipt", async (ctx) => {
  await ctx.reply(
    `📸 <b>SEND YOUR PAYMENT RECEIPT</b>\n\n` +
      `Please send your payment receipt as an image.\n\n` +
      `📝 <b>Make sure your receipt shows:</b>\n` +
      `• Your name\n` +
      `• Payment amount\n` +
      `• Transaction reference\n` +
      `• Bank details\n\n` +
      `<i>Just send the image and we'll process it within 24 hours!</i>`,
    { parse_mode: "HTML" }
  );
});

// Handle receipt images - when users send receipt images
bot.on("photo", async (ctx) => {
  try {
    const userId = ctx.from.id;
    const user = await User.findOne({ telegramId: userId });

    if (!user) {
      await ctx.reply("❌ Please connect your account first using /start");
      return;
    }

    // Get the largest photo size
    const photo = ctx.message.photo[ctx.message.photo.length - 1];
    const fileId = photo.file_id;

    // Get selected service from user's session or use default
    const selectedService =
      ctx.session && ctx.session.selectedService
        ? ctx.session.selectedService
        : {
            name: "Unknown Service",
            price: 0,
            currency: "USD",
            description: "Payment receipt uploaded via Telegram",
          };

    // Create a pending payment record
    const payment = new Payment({
      userId: user._id,
      userEmail: user.email,
      service: {
        name: selectedService.name,
        price: selectedService.price,
        description: selectedService.description,
      },
      amount: selectedService.price,
      currency: selectedService.currency,
      status: "pending",
      receiptFileId: fileId,
      receiptFileName: `receipt_${Date.now()}.jpg`,
    });

    await payment.save();

    // Get admin info to send notification
    const adminInfo = await getAdminInfo();

    if (adminInfo.adminId) {
      // Send receipt to admin with user details and payment info
      await bot.telegram.sendPhoto(adminInfo.adminId, fileId, {
        caption:
          `📸 <b>PAYMENT RECEIPT RECEIVED</b>\n\n` +
          `👤 <b>User:</b> ${user.firstName} ${user.lastName}\n` +
          `📧 <b>Email:</b> ${user.email}\n` +
          `🆔 <b>Telegram ID:</b> ${userId}\n` +
          `💰 <b>Payment ID:</b> ${payment._id}\n` +
          `サービ <b>Service:</b> ${payment.service.name}\n` +
          `💵 <b>Amount:</b> $${payment.amount}\n` +
          `📅 <b>Received:</b> ${new Date().toLocaleString()}\n\n` +
          `💳 <b>To approve payment:</b>\n` +
          `Use: <code>/togglepayment ${payment._id}</code>\n` +
          `Or use: <code>/approvePayment ${payment._id}</code>\n\n` +
          `⏰ <i>Please review and approve within 24 hours</i>`,
        parse_mode: "HTML",
      });

      // Confirm to user that receipt was received
      await ctx.reply(
        `✅ <b>RECEIPT RECEIVED!</b>\n\n` +
          `Thank you ${user.firstName}! We've received your payment receipt.\n\n` +
          `📋 <b>Payment Details:</b>\n` +
          `サービ <b>Service:</b> ${payment.service.name}\n` +
          `💵 <b>Amount:</b> $${payment.amount}\n` +
          `📄 <b>Payment ID:</b> ${payment._id}\n` +
          `🔄 <b>Status:</b> ${payment.status}\n\n` +
          `📋 <b>What happens next:</b>\n` +
          `• We'll review your receipt within 24 hours\n` +
          `• You'll receive a confirmation when approved\n` +
          `• Your service will be activated automatically\n\n` +
          `📞 <b>Need help?</b> Contact support at:\n` +
          `<a href="https://wa.me/2349032085666">WhatsApp Support</a>\n\n` +
          `⏰ <i>You'll get notified as soon as your payment is processed!</i>`,
        {
          parse_mode: "HTML",
          ...Markup.inlineKeyboard([
            [Markup.button.callback("📊 Check My Status", "check_status")],
            [Markup.button.callback("🏠 Main Menu", "main_menu")],
          ]).oneTime(),
        }
      );
    } else {
      // Fallback if no admin is set
      await ctx.reply(
        `✅ Receipt received! We'll process it soon.\n\n` +
          `Please contact support if you don't hear back within 24 hours.`
      );
    }
  } catch (error) {
    console.error("Error handling receipt image:", error);
    await ctx.reply(
      "❌ Sorry, there was an error processing your receipt. Please try again or contact support."
    );
  }
});

// Handle receipt documents - when users send receipt documents (PDF, etc.)
bot.on("document", async (ctx) => {
  try {
    const userId = ctx.from.id;
    const user = await User.findOne({ telegramId: userId });

    if (!user) {
      await ctx.reply("❌ Please connect your account first using /start");
      return;
    }

    // Get document info
    const document = ctx.message.document;
    const fileId = document.file_id;
    const fileName = document.file_name;

    // Get selected service from user's session or use default
    const selectedService =
      ctx.session && ctx.session.selectedService
        ? ctx.session.selectedService
        : {
            name: "Unknown Service",
            price: 0,
            currency: "USD",
            description: "Payment receipt uploaded via Telegram",
          };

    // Create a pending payment record
    const payment = new Payment({
      userId: user._id,
      userEmail: user.email,
      service: {
        name: selectedService.name,
        price: selectedService.price,
        description: selectedService.description,
      },
      amount: selectedService.price,
      currency: selectedService.currency,
      status: "pending",
      receiptFileId: fileId,
      receiptFileName: fileName,
    });

    await payment.save();

    // Get admin info to send notification
    const adminInfo = await getAdminInfo();

    if (adminInfo.adminId) {
      // Send receipt to admin with user details and payment info
      await bot.telegram.sendDocument(adminInfo.adminId, fileId, {
        caption:
          `📄 <b>PAYMENT RECEIPT RECEIVED</b>\n\n` +
          `👤 <b>User:</b> ${user.firstName} ${user.lastName}\n` +
          `📧 <b>Email:</b> ${user.email}\n` +
          `🆔 <b>Telegram ID:</b> ${userId}\n` +
          `💰 <b>Payment ID:</b> ${payment._id}\n` +
          `サービ <b>Service:</b> ${payment.service.name}\n` +
          `💵 <b>Amount:</b> $${payment.amount}\n` +
          `📅 <b>Received:</b> ${new Date().toLocaleString()}\n\n` +
          `💳 <b>To approve payment:</b>\n` +
          `Use: <code>/togglepayment ${payment._id}</code>\n` +
          `Or use: <code>/approvePayment ${payment._id}</code>\n\n` +
          `⏰ <i>Please review and approve within 24 hours</i>`,
        parse_mode: "HTML",
      });

      // Confirm to user that receipt was received
      await ctx.reply(
        `✅ <b>RECEIPT RECEIVED!</b>\n\n` +
          `Thank you ${user.firstName}! We've received your payment receipt.\n\n` +
          `📋 <b>Payment Details:</b>\n` +
          `서비스 <b>Service:</b> ${payment.service.name}\n` +
          `💵 <b>Amount:</b> $${payment.amount}\n` +
          `📄 <b>Payment ID:</b> ${payment._id}\n` +
          `🔄 <b>Status:</b> ${payment.status}\n\n` +
          `📋 <b>What happens next:</b>\n` +
          `• We'll review your receipt within 24 hours\n` +
          `• You'll receive a confirmation when approved\n` +
          `• Your service will be activated automatically\n\n` +
          `📞 <b>Need help?</b> Contact support at:\n` +
          `<a href="https://wa.me/2349032085666">WhatsApp Support</a>\n\n` +
          `⏰ <i>You'll get notified as soon as your payment is processed!</i>`,
        {
          parse_mode: "HTML",
          ...Markup.inlineKeyboard([
            [Markup.button.callback("📊 Check My Status", "check_status")],
            [Markup.button.callback("🏠 Main Menu", "main_menu")],
          ]).oneTime(),
        }
      );
    } else {
      // Fallback if no admin is set
      await ctx.reply(
        `✅ Receipt received! We'll process it soon.\n\n` +
          `Please contact support if you don't hear back within 24 hours.`
      );
    }
  } catch (error) {
    console.error("Error handling receipt document:", error);
    await ctx.reply(
      "❌ Sorry, there was an error processing your receipt. Please try again or contact support."
    );
  }
});

// Admin command to approve payments by payment ID
bot.command("approvePayment", isAdminMiddleware, async (ctx) => {
  try {
    // Get the payment ID from command arguments
    const args = ctx.message.text.split(" ");

    if (args.length < 2) {
      await ctx.reply(
        "❌ Please provide a payment ID. Usage: /approvePayment [payment_id]"
      );
      return;
    }

  const paymentId = args[1].trim();

    // Validate paymentId
    if (!paymentId || !mongoose.isValidObjectId(paymentId)) {
      await ctx.reply(
        "❌ The provided payment ID is invalid. Please provide a valid payment ID. Usage: /approvePayment [payment_id]"
      );
      return;
    }

    // Find the payment by ID
    const payment = await Payment.findById(paymentId);

    if (!payment) {
      await ctx.reply(
        "❌ Payment with ID " + paymentId + " not found in our system."
      );
      return;
    }

    // Find the user associated with this payment
    const user = await User.findById(payment.userId);

    if (!user) {
      await ctx.reply(
        "❌ User associated with this payment not found in our system."
      );
      return;
    }

    // Update payment status to completed
    const oldStatus = payment.status;
  payment.status = "completed";
  // Try to store the admin DB _id (if admin is registered in DB), otherwise store the telegram id
  const adminRecord = await Admin.findOne({ telegramId: ctx.from.id });
  payment.processedBy = adminRecord ? adminRecord._id : ctx.from.id;
  payment.processedAt = new Date();
    await payment.save();

    await ctx.reply(
      "<b>✅ Successfully approved payment for " +
        user.firstName +
        " " +
        user.lastName +
        " (" +
        user.email +
        ")</b>\n" +
        "<b>Payment ID:</b> " +
        payment._id +
        "\n" +
        "<b>Service:</b> " +
        payment.service.name +
        "\n" +
        "<b>Amount:</b> $" +
        payment.amount +
        "\n" +
        "<b>New status:</b> Completed",
      { parse_mode: "HTML" }
    );

    // Send a notification to the user about their payment approval
    if (user.telegramId) {
      try {
        await bot.telegram.sendMessage(
          user.telegramId,
          `<b>🔔 Payment Approved</b>\n\n` +
            `Great news! Your payment has been approved.\n\n` +
            `📋 <b>Payment Details:</b>\n` +
            `サービ <b>Service:</b> ${payment.service.name}\n` +
            `💵 <b>Amount:</b> $${payment.amount}\n` +
            `📄 <b>Payment ID:</b> ${payment._id}\n` +
            `📅 <b>Approved:</b> ${new Date().toLocaleString()}\n\n` +
            `Your service is now active and you can enjoy all the benefits!`,
          { parse_mode: "HTML" }
        );
      } catch (error) {
        console.error(
          `Failed to send notification to user ${user.telegramId}:`,
          error
        );
      }
    }

    // Also update the user's payment status to true
    const oldUserStatus = user.paymentStatus;
    user.paymentStatus = true;
    await user.save();

    // Send payment confirmation email
    try {
      // Import the sendPaymentConfirmationEmail function
      const { sendPaymentConfirmationEmail } = await import(
        "../config/email.js"
      );

      // Send payment confirmation email
      await sendPaymentConfirmationEmail(user, payment.service);
    } catch (emailError) {
      console.error("Failed to send payment confirmation email:", emailError);
    }

    // Send a second notification to the user about their activated service
    if (user.telegramId) {
      try {
        await bot.telegram.sendMessage(
          user.telegramId,
          `<b>✅ Service Activated</b>\n\n` +
            `Your service is now active!\n\n` +
            `サービ <b>Service:</b> ${payment.service.name}\n` +
            `💰 <b>Status:</b> ACTIVE\n\n` +
            `You can now receive educational content and broadcasts.`,
          { parse_mode: "HTML" }
        );
      } catch (error) {
        console.error(
          `Failed to send service activation notification to user ${user.telegramId}:`,
          error
        );
      }
    }
  } catch (error) {
    console.error("Error in approvePayment command:", error);
    await ctx.reply(
      "An error occurred while approving the payment. Please try again later."
    );
  }
});

export default bot;
