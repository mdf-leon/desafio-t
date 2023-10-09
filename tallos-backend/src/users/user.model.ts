import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  permissions: {
    type: [String],
    required: true,
    enum: [
      'changePermissions',
      'createUser',
      'readUser',
      'updateUser',
      'deleteUser',
    ],
    default: [
      'changePermissions',
      'createUser',
      'readUser',
      'updateUser',
      'deleteUser',
    ],
  },
});

export interface User extends mongoose.Document {
  id: string;
  username: string;
  password: string;
  permissions: string[];
}
