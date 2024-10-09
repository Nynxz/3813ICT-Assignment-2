import { MessageModel } from './types/message';

// POST /message/send
export async function db_message_send(
  message: string,
  channel: string,
  from: string,
  images: string[],
) {
  let newMessage = new MessageModel({
    content: message,
    channel: channel,
    sender: from,
    images,
  });
  return await newMessage.save();
}
