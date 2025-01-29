import mongoose from "mongoose";

const seriesSchema = new mongoose.Schema({
  kg: { type: Number, default: 0 },
  reps: { type: Number, default: 0 },
});

const exerciseSchema = new mongoose.Schema({
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
  name: { type: String, default: "" },
  description: { type: String, default: "" },
  exercises: { type: [exerciseSchema], default: [] },
});

const WorkoutSet = mongoose.model("WorkoutSet", workoutSetSchema);

export default WorkoutSet;
