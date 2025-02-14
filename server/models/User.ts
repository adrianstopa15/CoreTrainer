import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  login: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  surname: { type: String, required: true },
  password: { type: String, required: true },
  firstLogin: { type: Boolean, default: true },
  userFeatures: {
    roles: { type: [String], default: [] },
    weight: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    goal: { type: String, default: "" },
    age: { type: Number, default: 0 },
    gender: { type: String, enum: ["man", "woman"], default: "man" },
    experience: { type: String, default: "" },
    subroles: { type: [String], default: [] },
  },
});

const User = mongoose.model("User", userSchema);
export default User;
