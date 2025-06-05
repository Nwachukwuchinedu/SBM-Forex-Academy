import { Router } from "express";
import {
  register,
  login,
  getCurrentUser,
  refreshToken,
  logout,
  updateProfile,
  updatePassword,
  verifyEmail,
  resendVerificationEmail,
} from "../controllers/auth.controller.js";
import {
  validateRegistration,
  validateLogin,
} from "../middleware/validate.middleware.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import User from "../models/User.js";

const router = Router();

router.post("/register", validateRegistration, register);
router.get("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerificationEmail);
router.post("/login", validateLogin, login);
router.get("/me", requireAuth, getCurrentUser);
router.post("/refresh", refreshToken);
router.post("/logout", logout);
router.put("/update-profile", requireAuth, updateProfile);
router.put("/update-password", requireAuth, updatePassword);

// Debug route to check verification tokens (remove in production)
router.get("/debug-tokens", async (req, res) => {
  try {
    const users = await User.find({ 
      emailVerificationToken: { $exists: true, $ne: null } 
    }).select('email emailVerificationToken emailVerificationExpires isEmailVerified');
    
    res.json({
      message: "Debug info for verification tokens",
      users: users.map(user => ({
        email: user.email,
        token: user.emailVerificationToken,
        expires: user.emailVerificationExpires,
        expired: user.emailVerificationExpires < new Date(),
        verified: user.isEmailVerified
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
