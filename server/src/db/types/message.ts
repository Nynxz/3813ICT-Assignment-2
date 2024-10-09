import mongoose, { Schema } from 'mongoose';

let MessageSchema = new Schema({
  from: String,
  content: String,
  images: [String],
  channel: {
    type: Schema.Types.ObjectId,
    ref: 'Channel',
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

export const MessageModel = mongoose.model('Message', MessageSchema);
