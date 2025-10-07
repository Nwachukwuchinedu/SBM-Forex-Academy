import User from "../models/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../middleware/auth.middleware.js";
import { sendVerificationEmail } from "../config/email.js";

// Register Controller with email fallback
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    console.log("Generated verification token:", verificationToken);
    console.log("Token expires at:", verificationExpires);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires,
    });

    console.log("User created with token:", user.emailVerificationToken);

    // Try to send verification email
    try {
      console.log("Attempting to send verification email to:", email);
      await sendVerificationEmail(email, verificationToken, firstName);
      console.log("✅ Verification email sent successfully to:", email);

      res.status(201).json({
        message:
          "Registration successful! Please check your email to verify your account.",
        userId: user._id,
        emailSent: true,
      });
    } catch (emailError) {
      console.error("❌ Email sending failed:", {
        message: emailError.message,
        stack: emailError.stack,
        user: { email, firstName },
      });

      // Registration was successful, but email failed
      res.status(201).json({
        message:
          "Registration successful! However, we couldn't send the verification email. You can request a new verification email later.",
        userId: user._id,
        emailSent: false,
        emailError: emailError.message,
      });
    }
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// Verify Email Controller
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    console.log("Received token from query:", token);
    console.log("Token type:", typeof token);
    console.log("Token length:", token ? token.length : "null");

    if (!token) {
      return res
        .status(400)
        .json({ message: "Verification token is required" });
    }

    // Clean the token (remove any potential encoding issues)
    const cleanToken = decodeURIComponent(token.toString().trim());
    console.log("Cleaned token:", cleanToken);
    console.log("Current time:", new Date());

    // First, let's see what users exist with verification tokens
    const usersWithTokens = await User.find({
      emailVerificationToken: { $exists: true, $ne: null },
    }).select("email emailVerificationToken emailVerificationExpires");

    console.log(
      "Users with verification tokens:",
      usersWithTokens.map((u) => ({
        email: u.email,
        token: u.emailVerificationToken,
        expires: u.emailVerificationExpires,
        expired: u.emailVerificationExpires < new Date(),
      }))
    );

    const user = await User.findOne({
      emailVerificationToken: cleanToken,
      emailVerificationExpires: { $gt: Date.now() },
    });

    console.log(
      "Found user:",
      user
        ? {
            email: user.email,
            tokenMatch: user.emailVerificationToken === cleanToken,
            tokenExpired: user.emailVerificationExpires < new Date(),
          }
        : "null"
    );

    if (!user) {
      // Let's also check if there's a user with this token but expired
      const expiredUser = await User.findOne({
        emailVerificationToken: cleanToken,
      });

      if (expiredUser) {
        console.log("Found expired token for user:", expiredUser.email);
        return res.status(400).json({
          message:
            "Verification token has expired. Please request a new verification email.",
        });
      }

      return res.status(400).json({
        message: "Invalid or expired verification token",
      });
    }

    // Update user verification status
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    console.log("User verified successfully:", user.email);

    // Generate tokens for immediate login
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      message: "Email verified successfully! You are now logged in.",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({ message: "Server error during verification" });
  }
};

// Resend Verification Email
export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    console.log("Resend - Generated new token:", verificationToken);

    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = verificationExpires;
    await user.save();

    // Try to send verification email
    try {
      await sendVerificationEmail(email, verificationToken, user.firstName);
      res.json({
        message: "Verification email sent successfully",
        emailSent: true,
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError.message);
      res.status(500).json({
        message: "Failed to send verification email. Please try again later.",
        emailSent: false,
        error: "Email service temporarily unavailable",
      });
    }
  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login Controller (make email verification optional for now)
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // For now, allow login without email verification but warn user
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    await User.findByIdAndUpdate(user._id, { refreshToken });

    const response = {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      },
    };

    if (!user.isEmailVerified) {
      response.warning =
        "Please verify your email address to secure your account";
    }

    res.json(response);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Current User
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -refreshToken"
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Refresh Token
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(401).json({ message: "No token provided" });

    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    await User.findByIdAndUpdate(user._id, { refreshToken: newRefreshToken });

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid refresh token" });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await User.updateOne({ refreshToken }, { $unset: { refreshToken: 1 } });
    }
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update Profile
export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { firstName, lastName },
      { new: true }
    ).select("-password -refreshToken");

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update Password
export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(req.user.id, { password: hashedPassword });

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
