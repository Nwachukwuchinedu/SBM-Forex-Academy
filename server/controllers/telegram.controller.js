// Import required modules
import User from "../models/User.js";
import crypto from "crypto";

// In-memory storage for connection tokens (in production, use Redis or database)
export const connectionTokens = new Map();

// Controller to generate connection token
const generateConnectionToken = async (req, res) => {
  try {
    // Get user from request (assuming they're authenticated)
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Generate a unique connection token
    const connectionToken = crypto.randomBytes(20).toString("hex");

    // Store token with user ID and expiration (10 minutes)
    connectionTokens.set(connectionToken, {
      userId: user.id, // Fixed: user.id is already a string from JWT payload
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    });

    // Clean up expired tokens (in production, use a background job)
    for (const [token, data] of connectionTokens.entries()) {
      if (data.expiresAt < Date.now()) {
        connectionTokens.delete(token);
      }
    }

    res.json({
      success: true,
      message: "Connection token generated successfully",
      data: {
        connectionToken,
        expiresAt: Date.now() + 10 * 60 * 1000,
      },
    });
  } catch (error) {
    console.error("Error generating connection token:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while generating connection token",
    });
  }
};

// Controller to connect user account with Telegram
const connectTelegramAccount = async (req, res) => {
  try {
    const { telegramId, connectionToken } = req.body;

    // Validate required fields
    if (!telegramId || !connectionToken) {
      return res.status(400).json({
        success: false,
        message: "Telegram ID and connection token are required",
      });
    }

    // Check if token exists and is valid
    const tokenData = connectionTokens.get(connectionToken);

    if (!tokenData) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired connection token",
      });
    }

    // Check if token is expired
    if (tokenData.expiresAt < Date.now()) {
      connectionTokens.delete(connectionToken);
      return res.status(400).json({
        success: false,
        message: "Connection token has expired",
      });
    }

    // Find user by ID from token data
    const user = await User.findById(tokenData.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update user with Telegram ID
    user.telegramId = telegramId;
    await user.save();

    // Remove used token
    connectionTokens.delete(connectionToken);

    res.json({
      success: true,
      message: "Successfully connected your Telegram account",
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        paymentStatus: user.paymentStatus,
      },
    });
  } catch (error) {
    console.error("Error connecting Telegram account:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while connecting your account",
    });
  }
};

// Export controllers
export { generateConnectionToken, connectTelegramAccount };
