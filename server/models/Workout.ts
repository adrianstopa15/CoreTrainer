import mongoose, { mongo } from "mongoose";

const seriesSchema = new mongoose.Schema({
  kg: { type: Number },
  reps: { type: Number },
});

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bodySection: { type: String, required: true },
  bodyPart: { type: String, required: true },
  img: { type: String, default: null },
  series: { type: [seriesSchema], default: [] },
});

const workoutSchema = new mongoose.Schema({
  name: { type: String },
  date: { type: Date, required: true },
  exercises: { type: [exerciseSchema], default: [] },
});

const Workout = mongoose.model("Workout", workoutSchema);

export default Workout;
