import { check_userIsAdminOfGroup } from './channel';
import { ChannelModel } from './types/channel';
import { Group, GroupModel } from './types/group';
import { Roles, UserModel } from './types/user';
import { ObjectId } from 'mongodb';

// POST /groups/update
export async function db_group_update(newServerDetails: Group) {
  console.log(newServerDetails);
  const { _id, ...details } = newServerDetails;
  return await GroupModel.findOneAndUpdate({ _id }, details);
  // return await MongoClient.db("3813ICT")
  //   .collection("servers")
  //   .replaceOne({ _id: new ObjectId(_id) }, details);
}

// POST /groups/create
export async function db_group_create(user: any, group: Group) {
  let newGroup = await new GroupModel(group).save();
  newGroup.admins.push(new ObjectId(user as string));
  newGroup.users.push(new ObjectId(user as string));
  await newGroup.save();
  await UserModel.findOneAndUpdate(
    { _id: user },
    { $addToSet: { groups: newGroup._id } },
  );
  return newGroup;
}

// POST /groups/delete
export async function db_group_delete(group: Group) {
  return GroupModel.deleteOne({ _id: group._id });
}

export async function db_all_groups() {
  return GroupModel.find().populate(['requestedUsers', 'users']); // If super get all groups
}

//TODO: Move to user?
// GET /groups
export async function db_user_groups(_user: any) {
  if (_user.roles.includes(2)) {
    return GroupModel.find().populate([
      {
        path: 'requestedUsers',
        select: 'username',
      },
      'users',
    ]); // If super get all groups
  } else {
    let user = await UserModel.findById(_user._id).populate({
      path: 'groups',
      populate: {
        path: 'users',
      },
    });
    if (user !== null) {
      return user.groups;
    }
    return [];
    // Else gets groups user is admin and user of, removing duplicates
    // let user = await UserModel.findById(_user._id).populate("groups");
    // let groups = await GroupModel.find({
    //   admins: [new ObjectId(_user._id as string)],
    // });
    // let a = user?.groups.filter((e) => {
    //   let clean = true;
    //   groups.forEach((x) => {
    //     if (x._id.toString() == e._id.toString()) {
    //       clean = false;
    //     }
    //   });
    //   return clean;
    // });
    //
    // return [...(a as any), ...groups];
  }
}

// GET /groups/users
export async function db_group_users(groupId: string) {
  let group = await GroupModel.findById(groupId);
  let b = await UserModel.find({ groups: new ObjectId(group?._id) }).exec();
  return b;
  // return await MongoClient.db("3813ICT")
  //   .collection("servers")
  //   .replaceOne({ _id: new ObjectId(_id) }, details);
}

// POST /groups/adduser
export async function db_group_add_user(username: string, groupID: string) {
  let user = await UserModel.findOne({ username });
  let group = await GroupModel.findById(groupID);
  if (group && username) {
    user?.groups.push(group._id);
    return await user?.save();
  }
  return false;
}

export async function db_group_request_to_join(id: string, groupID: string) {
  console.log('Requesting');
  try {
    let a = await GroupModel.findOneAndUpdate(
      { _id: groupID },
      { $addToSet: { requestedUsers: new ObjectId(id) } },
      { returnDocument: 'after' },
    );
    console.log(a?.requestedUsers);
    return a;
  } catch (e) {
    console.log(e);
  }
}

export async function db_respond_group_request_to_join(
  id: string,
  groupID: string,
  allow: boolean,
) {
  console.log('Requesting');
  try {
    console.log(allow);
    if (allow) {
      let a = await GroupModel.findOneAndUpdate(
        { _id: groupID },
        {
          $addToSet: { users: new ObjectId(id) },
          $pull: { requestedUsers: new ObjectId(id) },
        },
        { returnDocument: 'after' },
      );
      await UserModel.findOneAndUpdate(
        { _id: id },
        {
          $addToSet: { groups: new ObjectId(groupID) },
        },
        { returnDocument: 'after' },
      );
      return a;
    } else {
      let a = await GroupModel.findOneAndUpdate(
        { _id: groupID },
        {
          $pull: { requestedUsers: new ObjectId(id) },
        },
        { returnDocument: 'after' },
      );
      return a;
    }
  } catch (e) {
    console.log(e);
  }
}

export async function db_group_cancel_request_to_join(
  id: string,
  groupID: string,
) {
  console.log('Requesting');
  try {
    let a = await GroupModel.findOneAndUpdate(
      { _id: groupID },
      { $pull: { requestedUsers: new ObjectId(id) } },
      { returnDocument: 'after' },
    );
    console.log(a?.requestedUsers);
    return a;
  } catch (e) {
    console.log(e);
  }
}

// POST /groups/removeuser
export async function db_group_remove_user(username: string, groupID: string) {
  let user = await UserModel.findOne({ username });
  let group = await GroupModel.findById(groupID);
  if (group && username) {
    let index = user?.groups.indexOf(group._id);
    if (index && index >= 0) {
      user?.groups.splice(index!, 1);
    }
    return await user?.save();
  }
  return false;
}

// GET /groups/channels
export async function db_group_channels(
  user: { _id: string; roles: Roles[] },
  group: string,
) {
  if (
    (await check_userIsAdminOfGroup(user._id, group)) ||
    user.roles.includes(Roles.SUPER)
  ) {
    return await ChannelModel.find({ group }).exec();
  } else {
    return await ChannelModel.find({ group, users: user }).exec();
  }
}

export async function db_group_populate(group: string) {
  return GroupModel.findById(group).populate([
    { path: 'users', select: 'username' },
    'channels',
    { path: 'requestedUsers', select: ['username', '_id'] },
    { path: 'admins', select: ['username', '_id'] },
  ]);
}

// POST /groups/promoteuser
export async function db_group_promote_user_to_group_admin(
  username: string,
  groupID: string,
  requesterID: string,
) {
  let user = await UserModel.findOne({ username });
  if (await check_userIsAdminOfGroup(requesterID, groupID)) {
    if (requesterID == user?.id) {
      return { error: 'cannot remove self as admin' };
    }
    let channel = await GroupModel.findOne({ _id: groupID });
    if (!channel?.admins.includes(user!._id)) {
      channel?.admins.push(user!._id);
    } else {
      let i = channel?.admins.indexOf(user!._id);
      channel.admins.splice(i, 1);
    }
    return await channel?.save();
  } else {
    return { error: 'insufficent permissions' };
  }
}
