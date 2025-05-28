import { Router } from "express";
import {
  register,
  login,
  getCurrentUser,
  refreshToken,
  logout,
} from "../controllers/auth.controller.js";
import {
  validateRegistration,
  validateLogin,
} from "../middleware/validate.middleware.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", validateRegistration, register);
router.post("/login", validateLogin, login);
router.get("/me", requireAuth, getCurrentUser);
router.get("/refresh", refreshToken);
router.post("/logout", logout);

export default router;
