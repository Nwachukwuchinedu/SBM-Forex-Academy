import { Router } from "express";
import {
  register,
  login,
  getCurrentUser,
  refreshToken,
  logout,
  updateProfile,
  updatePassword,
} from "../controllers/auth.controller.js";
import {
  validateRegistration,
  validateLogin,
} from "../middleware/validate.middleware.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", validateRegistration, register);
router.put("/update-profile", requireAuth, updateProfile);
router.put("/update-password", requireAuth, updatePassword);
router.post("/login", validateLogin, login);
router.get("/me", requireAuth, getCurrentUser);
router.get("/refresh", refreshToken);
router.post("/logout", logout);

export default router;
