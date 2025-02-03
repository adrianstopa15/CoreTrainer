import mongoose, { Schema } from "mongoose";

const friendsSchema = new mongoose.Schema({
  requester: { type: Schema.Types.ObjectId, ref: "Users" },
  receiver: { type: Schema.Types.ObjectId, ref: "Users" },
  enums: [
    0, //add friend,
    1, //requested,
    2, //pending,
    3, //friends
  ],
});

module.exports = mongoose.model("Friends", friendsSchema);
