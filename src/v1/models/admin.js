import mongoose from "mongoose";

const { Schema, model } = mongoose;

const adminSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export default model("admin", adminSchema);
