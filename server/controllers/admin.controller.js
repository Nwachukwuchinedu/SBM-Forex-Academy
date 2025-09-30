import Admin from "../models/Admin.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register Admin
export const registerAdmin = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existing = await Admin.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await Admin.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Admin registered",
      admin: { id: admin._id, username, email },
    });
  } catch (err) {
    res.status(500).json({ message: `Server error: ${err.message}` });
  }
};

// Login Admin
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // You can use your JWT secret from .env or config
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      admin: { id: admin._id, username: admin.username, email: admin.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get current admin profile
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select("-password");
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    // Check if the requester is an admin
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }
    const users = await User.find().select("-password -refreshToken");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update Admin Password
export const updateAdminPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    // Find admin by ID from decoded token (set in middleware)
    const admin = await Admin.findById(req.user.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    // Compare current password
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch)
      return res.status(400).json({ message: "Current password is incorrect" });

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    admin.password = hashedPassword;
    await admin.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update Admin Telegram ID
export const updateAdminTelegramId = async (req, res) => {
  const { telegramId } = req.body;

  try {
    // Find admin by ID from decoded token (set in middleware)
    const admin = await Admin.findById(req.user.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    // Update Telegram ID
    admin.telegramId = telegramId;
    await admin.save();

    res.json({ message: "Telegram ID updated successfully", telegramId });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update Admin Telegram Group Invite Link
export const updateAdminTelegramGroupInviteLink = async (req, res) => {
  const { telegramGroupInviteLink } = req.body;

  try {
    // Find admin by ID from decoded token (set in middleware)
    const admin = await Admin.findById(req.user.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    // Update Telegram Group Invite Link
    admin.telegramGroupInviteLink = telegramGroupInviteLink;
    await admin.save();

    res.json({
      message: "Telegram Group Invite Link updated successfully",
      telegramGroupInviteLink,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get Admin Telegram Group Invite Link
export const getAdminTelegramGroupInviteLink = async (req, res) => {
  try {
    // Find admin by ID from decoded token (set in middleware)
    const admin = await Admin.findById(req.user.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    res.json({ telegramGroupInviteLink: admin.telegramGroupInviteLink });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
