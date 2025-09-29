// Import required modules
import { Router } from "express";
import {
  generateConnectionToken,
  connectTelegramAccount,
} from "../controllers/telegram.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

// Create router instance
const router = Router();

// Protect all telegram routes with authentication
router.use(requireAuth);

// Route to generate connection token
router.post("/generate-token", generateConnectionToken);

// Route to connect Telegram account
router.post("/connect", connectTelegramAccount);

// Export the router
export default router;
