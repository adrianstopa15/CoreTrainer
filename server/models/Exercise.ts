import mongoose, { Mongoose } from "mongoose";

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  bodySection: {
    type: String,
    enum: ["upper", "lower"],
    required: true,
  },
  bodyPart: { type: String, required: true },
  img: { type: String },
});

const Exercise = mongoose.model("Exercise", exerciseSchema);
export default Exercise;
