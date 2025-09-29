// Import required modules
import User from "../models/User.js";
import Admin from "../models/Admin.js";

// Reference to the connection tokens map from the controller
// In a real implementation, this would be a shared store like Redis
import { connectionTokens } from "../controllers/telegram.controller.js";

// Function to validate a connection token and connect the user's Telegram account
const validateAndConnectTelegramAccount = async (
  telegramId,
  connectionToken
) => {
  try {
    // Check if token exists and is valid
    const tokenData = connectionTokens.get(connectionToken);

    if (!tokenData) {
      return {
        success: false,
        message: "Invalid or expired connection token",
      };
    }

    // Check if token is expired
    if (tokenData.expiresAt < Date.now()) {
      connectionTokens.delete(connectionToken);
      return {
        success: false,
        message: "Connection token has expired",
      };
    }

    // Try to find user by ID from token data
    let account = await User.findById(tokenData.userId);
    let accountType = "user";

    // If not found in User, try Admin
    if (!account) {
      account = await Admin.findById(tokenData.userId);
      accountType = "admin";
    }

    if (!account) {
      return {
        success: false,
        message: "User not found",
      };
    }

    // Update account with Telegram ID
    account.telegramId = telegramId;
    await account.save();

    // Remove used token
    connectionTokens.delete(connectionToken);

    // Prepare response data based on account type
    let responseData;
    if (accountType === "admin") {
      responseData = {
        firstName: account.username,
        lastName: "",
        email: account.email,
        paymentStatus: true, // Admins always have access
        role: account.role,
      };
    } else {
      responseData = {
        firstName: account.firstName,
        lastName: account.lastName,
        email: account.email,
        paymentStatus: account.paymentStatus,
        role: account.role || "user",
      };
    }

    return {
      success: true,
      message: "Successfully connected your Telegram account",
      data: responseData,
    };
  } catch (error) {
    console.error("Error validating and connecting Telegram account:", error);
    return {
      success: false,
      message: "An error occurred while connecting your account",
    };
  }
};

// Export the function
export { validateAndConnectTelegramAccount };
