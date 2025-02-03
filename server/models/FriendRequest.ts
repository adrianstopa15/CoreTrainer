import mongoose, { Schema } from "mongoose";

const friendsRequestSchema = new mongoose.Schema({
  sender: { type: Schema.Types.ObjectId, ref: "Users", required: true },
  recipient: { type: Schema.Types.ObjectId, ref: "Users", required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

const FriendRequest = mongoose.model("FriendRequest", friendsRequestSchema);
export default FriendRequest;
