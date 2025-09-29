import { Router } from "express";
import {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  getAllUsers,
  updateAdminPassword,
  updateAdminTelegramId,
} from "../controllers/admin.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/me", requireAuth, getAdminProfile);
router.get("/users", requireAuth, getAllUsers);

// 🔐 Protected route to update password
router.put("/password", requireAuth, updateAdminPassword);

// 🔐 Protected route to update Telegram ID
router.put("/telegram-id", requireAuth, updateAdminTelegramId);

export default router;
