import { MessageModel } from "./types/message";

// POST /message/send
export async function db_message_send(
  message: string,
  channel: string,
  from: string
) {
  let newMessage = new MessageModel({
    content: message,
    channel: channel,
    sender: from,
  });
  return await newMessage.save();
}
