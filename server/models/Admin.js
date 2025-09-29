import mongoose from "mongoose";
import validator from "validator";

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "admin",
  },
  telegramId: {
    type: String,
    default: null,
  },
});

export default mongoose.model("Admin", adminSchema);
