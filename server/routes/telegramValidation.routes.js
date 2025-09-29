// Import required modules
import { Router } from "express";
import { validateAndConnectTelegramAccount } from "../utils/telegramTokenValidator.js";

// Create router instance
const router = Router();

// Route to validate connection token and connect Telegram account
router.post("/validate-token", async (req, res) => {
  try {
    const { telegramId, connectionToken } = req.body;

    // Validate required fields
    if (!telegramId || !connectionToken) {
      return res.status(400).json({
        success: false,
        message: "Telegram ID and connection token are required",
      });
    }

    // Validate the token and connect the account
    const result = await validateAndConnectTelegramAccount(
      telegramId,
      connectionToken
    );

    res.json(result);
  } catch (error) {
    console.error("Error validating Telegram connection token:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while validating the connection token",
    });
  }
});

// Export the router
export default router;
