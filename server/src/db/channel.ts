import user from "../routes/user";
import { ChannelModel } from "./types/channel";
import { GroupModel } from "./types/group";
import { MessageModel } from "./types/message";
import { UserModel } from "./types/user";
import { ObjectId } from "mongodb";

export async function check_userIsAdminOfChannel(
  user: string,
  channelID: string
) {
  let channel = await ChannelModel.findById(channelID);
  let group = await GroupModel.findById(channel?.group);
  if (channel && group && group.admins.includes(new ObjectId(user))) {
    return true;
  }
  return false;
}

export async function check_userIsAdminOfGroup(
  userID: string,
  groupID: string
) {
  let group = await GroupModel.findById(groupID);
  if (group && group.admins.includes(new ObjectId(userID))) {
    return true;
  }
  return false;
}

// GET /channel/messages
export async function db_channel_getMessages(channel: string) {
  return await MessageModel.find({ channel: channel })
    .populate("sender", "username")
    .exec();
}

// POST /channel/create
export async function db_channel_create(channel: object) {
  return await new ChannelModel(channel).save();
  // return await MongoClient.db("3813ICT")
  //   .collection("channels")
  //   .insertOne(channel);
}

// POST /channel/update
export async function db_channel_update(channel: { _id: string }) {
  return await ChannelModel.updateOne({ _id: channel._id }, channel);
}

// POST /channel/delete
export async function db_channel_delete(channel: { _id: string }) {
  return await ChannelModel.deleteOne({ _id: channel._id });
}

// GET /channel/users
export async function db_channel_users(channel: string) {
  return await ChannelModel.findOne({ _id: channel })
    .select("users")
    .populate("users", "username");
}

// POST /channel/adduser
export async function db_channel_add_user(channelID: string, username: string) {
  let channel = await ChannelModel.findById(channelID);
  let user = await UserModel.findOne({ username });
  if (channel && user) {
    channel.users.push(user._id);
    if (!user.groups.includes(channel.group!._id)) {
      console.log("Adding user to parent group");
      user.groups.push(channel.group!._id);
      await user.save();
    }
    return await channel?.save();
  }
}

// POST /channel/remove
export async function db_channel_remove_user(
  channelID: string,
  username: string
) {
  let channel = await ChannelModel.findById(channelID);
  let user = await UserModel.findOne({ username });
  if (channel && user) {
    let id = channel.users.indexOf(user._id);
    channel.users.splice(id, 1);
    return await channel?.save();
  }
}
