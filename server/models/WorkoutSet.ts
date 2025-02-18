import mongoose from "mongoose";

const seriesSchema = new mongoose.Schema({
  kg: { type: Number, default: 0 },
  reps: { type: Number, default: 0 },
});

const exerciseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  usersWithAccess: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  isGlobal: { type: Boolean, default: false },
  name: { type: String, required: true },
  bodySection: { type: String, required: true },
  bodyPart: { type: String, required: true },
  img: { type: String, default: null },
  series: { type: [seriesSchema], default: [] },
});

const workoutSetSchema = new mongoose.Schema({
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
  name: { type: String, default: "" },
  description: { type: String, default: "" },
  exercises: { type: [exerciseSchema], default: [] },
  isGlobal: { type: Boolean, default: false },
});

workoutSetSchema.pre("save", function (next) {
  if (!this.usersWithAccess.includes(this.userId)) {
    this.usersWithAccess.push(this.userId);
  }
  next();
});

const WorkoutSet = mongoose.model("WorkoutSet", workoutSetSchema);

export default WorkoutSet;
