import mongoose, { Mongoose } from "mongoose";

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  usersWithAccess: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  isGlobal: { type: Boolean, default: false },
  bodySection: {
    type: String,
    enum: ["upper", "lower"],
    required: true,
  },
  bodyPart: { type: String, required: true },
  img: { type: String },
});
exerciseSchema.pre("save", function (next) {
  if (!this.usersWithAccess.includes(this.userId)) {
    this.usersWithAccess.push(this.userId);
  }
  next();
});

const Exercise = mongoose.model("Exercise", exerciseSchema);
export default Exercise;
