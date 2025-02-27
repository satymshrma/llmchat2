import mongoose from "mongoose";

export interface Message extends mongoose.Document {
  content: string;
  createdAt: Date;
  updatedAt: Date;
  role: "user" | "system" | "assistant";
}

const MessageSchema = new mongoose.Schema<Message>({
  content: { type: String, required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
  role: {
    type: String,
    enum: ["user", "system", "assistant"],
    required: true,
  },
});

export interface Chat extends mongoose.Document {
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
}

const ChatSchema = new mongoose.Schema<Chat>({
  title: { type: String, required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
  messages: { type: [MessageSchema], required: true },
});

export interface User extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  Chats: Chat[];
}

const UserSchema = new mongoose.Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
  Chats: { type: [ChatSchema], required: true },
});

const UserModel =
  mongoose.models.User || mongoose.model<User>("User", UserSchema);

export default UserModel;
