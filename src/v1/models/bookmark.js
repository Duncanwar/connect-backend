import mongoose from "mongoose";

const { Schema, model } = mongoose;
const { ObjectId } = mongoose.Schema.Types;

const bookmarkSchema = new Schema(
  {
    postedId: {
      type: ObjectId,
      required: true,
      ref: "Post",
    },
    bookmarkedBy: { type: ObjectId, ref: "user" },
  },
  { timestamps: true },
  {
    toJSON: { virtuals: true },
  }
);

bookmarkSchema.virtual("frompost", {
  ref: "post",
  localField: "postedId",
  foreignField: "_id",
  justOne: true,
});
bookmarkSchema.virtual("fromuser", {
  ref: "user",
  localField: "bookmarkedBy",
  foreignField: "_id",
  justOne: true,
});

export default model("bookmark", bookmarkSchema);
