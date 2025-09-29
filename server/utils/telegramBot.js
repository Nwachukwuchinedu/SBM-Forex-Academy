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
  { command: "howtojoin", description: "Get instructions on how to join the group" },
  { command: "help", description: "Show help message" },
  { command: "logout", description: "Logout from your account" }
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
      console.log("Invalid TELEGRAM_GROUP_ID format, skipping group membership check");
      return true;
    }
    
    // Get chat member status
    const chatMember = await bot.telegram.getChatMember(
      process.env.TELEGRAM_GROUP_ID,
      userId
    );
    
    // Check if user is in the group
    // Status can be: 'creator', 'administrator', 'member', 'restricted', 'left', 'kicked'
    const validStatuses = ['creator', 'administrator', 'member', 'restricted'];
    return validStatuses.includes(chatMember.status);
  } catch (error) {
    console.error(`Error checking group membership for user ${userId}:`, error);
    // If there's an error (e.g., user never joined), return false
    // But also handle specific cases like chat not found
    if (error.response && error.response.error_code === 400) {
      console.log("Chat not found or invalid group ID, skipping group membership check");
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
      return { isValid: false, message: "Admin has not set their Telegram ID in the dashboard." };
    }
    
    // Check if the Telegram ID matches
    if (admin.telegramId.toString() !== userId.toString()) {
      return { isValid: false, message: "The Telegram ID does not match the one set in the admin dashboard." };
    }
    
    // If we get here, the user is verified as admin
    return { isValid: true, admin };
  } catch (error) {
    console.error("Error verifying admin connection:", error);
    return { isValid: false, message: "An error occurred while verifying admin credentials." };
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
      `🛡️ Admin Dashboard\n\nWelcome ${user.firstName || user.username}!`,
      Markup.inlineKeyboard([
        [Markup.button.callback("📊 Check Status", "check_status")],
        [Markup.button.callback("👥 Manage Users", "manage_users")],
        [Markup.button.callback("📢 Broadcast Message", "broadcast")],
        [Markup.button.callback("🔄 Toggle Payment", "toggle_payment")],
        [Markup.button.callback("❓ Help", "help")],
        [Markup.button.callback("🚪 Logout", "logout")]
      ]).oneTime()
    );
  } else {
    // Regular user menu
    await ctx.reply(
      `👤 User Dashboard\n\nWelcome ${user.firstName}!`,
      Markup.inlineKeyboard([
        [Markup.button.callback("📊 Check Status", "check_status")],
        [Markup.button.callback("❓ Help", "help")],
        [Markup.button.callback("🚪 Logout", "logout")]
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
    
    // New user - provide instructions
    let welcomeMessage = "Welcome! Please log in to your account to connect with the bot.";
    
    if (process.env.TELEGRAM_GROUP_ID) {
      welcomeMessage += "\n\n📢 Important: To receive educational content and broadcasts, you must join our Telegram group. Please make sure you've joined the group before connecting your account.";
    }
    
    await ctx.reply(
      welcomeMessage,
      Markup.inlineKeyboard([
        Markup.button.callback("Connect Account", "connect_account"),
        Markup.button.callback("How to Join Group", "how_to_join"),
        Markup.button.callback("Help", "help")
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
});

bot.action("how_to_join", async (ctx) => {
  // Create a mock message context to simulate the /howtojoin command
  const mockCtx = {
    ...ctx,
    message: {
      text: "/howtojoin",
      from: ctx.from,
      chat: ctx.chat
    }
  };
  
  // Call the howtojoin command handler directly
  await bot.command("howtojoin")(mockCtx);
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
    if (process.env.TELEGRAM_GROUP_ID) {
      const isInGroup = await isUserInGroup(userId);
      groupStatus = `\nGroup Membership: ${isInGroup ? "ACTIVE" : "INACTIVE"}`;
      
      if (!isInGroup) {
        groupStatus += "\n\n📢 Important: You must join our Telegram group to receive educational content and broadcasts. Please join the group to get full access.";
      }
    }

    await ctx.reply(
      `<b>📊 Payment Status</b>\n\n` +
      `Name: ${user.firstName} ${user.lastName}\n` +
      `Email: ${user.email}\n` +
      `<b>Status: ${user.paymentStatus ? "ACTIVE" : "INACTIVE"}</b>` +
      groupStatus +
      "\n\n" +
      (user.paymentStatus && (groupStatus.includes("ACTIVE") || !process.env.TELEGRAM_GROUP_ID)
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
  const adminId = await getAdminId();
  const isAdminUser = adminId && userId.toString() === adminId.toString();

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
  message += "• /connect - Connect your account\n";
  message += "• /token - Connect using a token\n";
  message += "• /howtojoin - Get instructions on how to join the group\n";
  message += "• /help - Show this help message\n";
  message += "• logout - Logout from your account\n\n";

  await ctx.reply(message);

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

    await ctx.reply(message);

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
    "<b>📢 Broadcast Message</b>\n\n" +
    "To broadcast a message to all paying users, use the command:\n" +
    "/broadcast Your message here"
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
    "<b>🔄 Toggle Payment Status</b>\n\n" +
    "To toggle a user's payment status, use the command:\n" +
    "/togglepayment [user_email]"
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
      `Once connected, you'll receive educational content from the group.`
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
        `${process.env.API_BASE_URL || "http://localhost:5000"}/api/telegram-validation/validate-token`,
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
              `<b>❌ Admin Verification Failed</b>\n\n` +
              `${adminVerification.message}\n\n` +
              `Please ensure you've set your Telegram ID in the admin dashboard and try again.`
            );
            return;
          }
          
          await ctx.reply(
            "<b>✅ Admin Connection Successful</b>\n\n" +
            "Welcome Admin! Your Telegram account is now connected.\n\n" +
            "You have full administrative privileges."
          );
          
          // Show admin menu
          await showMainMenu(ctx, adminVerification.admin);
        } else {
          // For regular users, check if they need to join the group
          let groupMessage = "";
          if (process.env.TELEGRAM_GROUP_ID) {
            // Check if user is in the group
            const isInGroup = await isUserInGroup(userId);
            
            if (!isInGroup) {
              groupMessage = "\n\n📢 Important Notice: You must join our Telegram group to receive educational content and broadcasts. " +
                "Please join the group now to get full access to our services.\n\n" +
                "Use /howtojoin to get instructions on how to join our group.";
            } else {
              groupMessage = "\n\n✅ You are already a member of our Telegram group. You will receive educational content and broadcasts.";
            }
          }
          
          await ctx.reply(
            "<b>✅ Connection Successful</b>\n\n" +
            "Welcome " + result.data.firstName + "! Your Telegram account is now connected.\n\n" +
            "<b>Payment Status: " + (result.data.paymentStatus ? "ACTIVE" : "INACTIVE") + "</b>\n" +
            (result.data.paymentStatus 
              ? "You will now receive educational content from the group (if you're a group member)." 
              : "You will not receive educational content until your payment status is active.") +
            groupMessage
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
          result.message + "\n\n" +
          "Please generate a new token and try again."
        );
      }
    } catch (apiError) {
      console.error("Error calling validation API:", apiError);
      await ctx.reply(
        "<b>❌ Connection Failed</b>\n\n" +
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
  message += "• /connect - Connect your account\n";
  message += "• /token - Connect using a token\n";
  message += "• /howtojoin - Get instructions on how to join the group\n";
  message += "• /help - Show this help message\n";
  message += "• /logout - Logout from your account\n\n";

  await ctx.reply(message);

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
      "<b>✅ Successfully updated payment status for " +
      user.firstName + " " + user.lastName + " (" + user.email + ")</b>\n" +
      "<b>New status: " + (user.paymentStatus ? "Paid" : "Not Paid") + "</b>"
    );

    // Send a notification to the user about their status change
    if (user.telegramId) {
      try {
        await bot.telegram.sendMessage(
          user.telegramId,
          `<b>🔔 Payment Status Update</b>\n\n` +
          `Your access status has been changed to <b>${user.paymentStatus ? "ACTIVE" : "INACTIVE"}</b>\n` +
          `You are now ${user.paymentStatus
            ? "able to receive educational content"
            : "no longer able to receive educational content"} from the group.`,
          { parse_mode: "HTML" }
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

    // Send message to each paying user
    for (const user of payingUsers) {
      try {
        // Check if user is in the Telegram group
        const isInGroup = await isUserInGroup(user.telegramId);
        
        if (!isInGroup) {
          console.log(`User ${user.email} is not in the group, skipping broadcast`);
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
            console.error(`Failed to notify user ${user.telegramId} about group membership:`, notifyError);
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

    await ctx.reply(
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
    await ctx.reply(
      "An error occurred while sending the broadcast message. Please try again later."
    );
  }
});

// Command to provide instructions on how to join the group
bot.command("howtojoin", async (ctx) => {
  try {
    const userId = ctx.from.id;
    
    // Check if this is an admin
    const adminId = await getAdminId();
    const isAdminUser = adminId && userId.toString() === adminId.toString();
    
    // Check if user is connected
    let user = null;
    if (!isAdminUser) {
      user = await User.findOne({ telegramId: userId });
    } else {
      user = await Admin.findOne({ telegramId: userId });
    }
    
    if (!user && !isAdminUser) {
      await ctx.reply(
        "ℹ️ You are not yet connected to your SBM Forex Academy account. \n" +
        "Please connect your account first using the /connect command."
      );
      return;
    }
    
    // Provide group joining instructions
    if (process.env.TELEGRAM_GROUP_ID) {
      // Use HTML formatting instead of Markdown to avoid parsing issues
      await ctx.reply(
        `<b>📢 How to Join Our Telegram Group</b>\n\n` +
        `To receive educational content and broadcasts, please follow these steps:\n\n` +
        `1. Click on this link to join our group: ${process.env.TELEGRAM_GROUP_INVITE_LINK || "Contact admin for the group link"}\n` +
        `2. After joining, you'll automatically start receiving educational content\n` +
        `3. If you've already joined but still see membership issues, try leaving and rejoining the group\n\n` +
        `Once you've joined the group, you'll be able to receive all broadcast messages and educational content.\n\n` +
        `If you continue to experience issues, please contact our support team.`,
        { parse_mode: "HTML" }
      );
    } else {
      await ctx.reply(
        "<b>📢 Group Information</b>\n\n" +
        "Our Telegram group information will be provided soon. Please check back later or contact support for more details.",
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
        "1. Click on this link to join our group: " + (process.env.TELEGRAM_GROUP_INVITE_LINK || "Contact admin for the group link") + "\n" +
        "2. After joining, you'll automatically start receiving educational content\n" +
        "3. If you've already joined but still see membership issues, try leaving and rejoining the group\n\n" +
        "Once you've joined the group, you'll be able to receive all broadcast messages and educational content.\n\n" +
        "If you continue to experience issues, please contact our support team."
      );
    } catch (fallbackError) {
      console.error("Fallback error in howtojoin command:", fallbackError);
      await ctx.reply("An error occurred while providing group joining instructions. Please try again later.");
    }
  }
});

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
            const isInGroup = process.env.TELEGRAM_GROUP_ID ? await isUserInGroup(user.telegramId) : true;
            
            if (process.env.TELEGRAM_GROUP_ID && !isInGroup) {
              console.log(`User ${user.email} is not in the group, skipping message forwarding`);
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
                console.error(`Failed to notify user ${user.telegramId} about group membership:`, notifyError);
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

// Export the bot instance and helper functions
export default bot;
export { isAdminMiddleware, canReceiveMessages };
