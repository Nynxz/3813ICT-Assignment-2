import mongoose, { Schema } from 'mongoose';
import { ObjectId } from 'mongodb';

let UserSchema = new Schema({
  username: String,
  email: String,
  password: String,
  profileImage: String,
  roles: [{ type: Number }],
  groups: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Group',
    },
  ],
});

export const UserModel = mongoose.model('User', UserSchema);

export enum Roles {
  'USER',
  'ADMIN',
  'SUPER',
  'NOBODY',
}

export type User = {
  _id: ObjectId;
  username: string;
  email: string;
  password: string;
  profileImage: string;
  roles?: Roles[];
  groups?: ObjectId[];
};
