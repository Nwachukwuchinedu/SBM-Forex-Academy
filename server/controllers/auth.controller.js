import User from "../models/User.js";
import bcrypt from "bcryptjs";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../middleware/auth.middleware.js";

// Register Controller
export const register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser)
    return res.status(400).json({ message: "Email already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  await User.findByIdAndUpdate(user._id, { refreshToken });

  res.status(201).json({ accessToken, refreshToken });
};

// Login Controller
export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  await User.findByIdAndUpdate(user._id, { refreshToken });

  res.json({ accessToken, refreshToken });
};

// Get Current User
export const getCurrentUser = async (req, res) => {
  const user = await User.findById(req.user.id).select(
    "-password -refreshToken"
  );
  res.json(user);
};

// Refresh Token
// Refresh Token
export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken)
    return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken)
      return res.status(403).json({ message: "Invalid refresh token" });

    const accessToken = generateAccessToken(user._id);
    res.json({ accessToken });
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

// Logout
export const logout = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken)
    return res.status(400).json({ message: "No token provided" });

  try {
    const decoded = verifyRefreshToken(refreshToken);
    await User.findByIdAndUpdate(decoded.id, { refreshToken: "" });
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
};

// Update Profile Controller (firstName and lastName only)
export const updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { firstName, lastName } = req.body;

  if (!firstName || !lastName) {
    return res
      .status(400)
      .json({ message: "First name and last name are required" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName },
      { new: true, select: "-password -refreshToken" }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update Password Controller
export const updatePassword = async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: "Current and new password are required" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Current password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
