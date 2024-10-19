import mongoose from "mongoose";

const { Schema, model } = mongoose;
const { ObjectId } = Schema.Types;

const privateChatSchema = new Schema({
  user1: { type: ObjectId, ref: "user" },
  user2: { type: ObjectId, ref: "user" },
  messages: [
    {
      content: String,
      user: { type: ObjectId, ref: "user" },
      createdDate: { type: Date, default: Date.now() },
    },
  ],
});

export default model("privateChatSchema", privateChatSchema);
