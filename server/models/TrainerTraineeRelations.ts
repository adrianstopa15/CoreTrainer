import mongoose from "mongoose";

const trainerTraineeRelationsSchema = new mongoose.Schema({
  trainerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  traineeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  status: {
    type: String,
    enum: ["pending", "active", "expired", "canceled", "rejected"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

const TrainerTraineeRelations = mongoose.model(
  "TrainerTraineeRelations",
  trainerTraineeRelationsSchema
);

export default TrainerTraineeRelations;
