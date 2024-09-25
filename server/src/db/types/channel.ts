import mongoose, { Schema } from "mongoose";

let ChannelSchema = new Schema({
  name: String,
  group: {
    type: Schema.Types.ObjectId,
    ref: "Group",
  },
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});
export const ChannelModel = mongoose.model("Channel", ChannelSchema);
