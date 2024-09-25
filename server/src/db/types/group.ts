import mongoose, { ObjectId, Schema } from "mongoose";

let GroupSchema = new Schema({
  name: String,
  imageURL: String,
  channels: [
    {
      type: Schema.Types.ObjectId,
      ref: "Channel",
    },
  ],
  admins: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  requestedUsers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});
export const GroupModel = mongoose.model("Group", GroupSchema);

export type Group = {
  _id: ObjectId;
  name: string;
};
