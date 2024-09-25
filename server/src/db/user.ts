import { Roles, User, UserModel } from "./types/user";

export async function db_user_create(user: Partial<User>) {
  const exists = await UserModel.exists({ username: user.username });
  if (!exists) {
    user.roles = [Roles.USER];
    let nn = new UserModel(user);
    let newUser = await nn.save();
    // let n = await MongoClient.db("3813ICT").collection("users").insertOne(user);
    console.log(newUser.toObject());
    return newUser.toObject() as Partial<User>;
  }
}

export async function db_user_find(user: Partial<User>) {
  const foundUser = await UserModel.findOne({
    username: user.username,
    password: user.password,
  }).exec();
  return foundUser?.toObject();
}

export async function db_users_all() {
  return await UserModel.find();
}

export async function db_user_update(user: Partial<User>) {
  return await UserModel.updateOne({ _id: user._id }, user);
}

export async function db_user_delete(user: Partial<User>) {
  console.log(user._id);
  return await UserModel.deleteOne({ _id: user._id });
}
