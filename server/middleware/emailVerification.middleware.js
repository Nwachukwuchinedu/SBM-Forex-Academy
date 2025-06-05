import User from "../models/User.js";

export const requireEmailVerification = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user.isEmailVerified) {
      return res.status(403).json({ 
        message: "Email verification required to access this resource",
        requiresVerification: true 
      });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};