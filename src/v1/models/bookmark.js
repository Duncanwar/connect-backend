const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types

const bookmarkSchema = new mongoose.Schema({
    postedId:{
        type: ObjectId,
        required: true,
        ref:"Post"
    },
    bookmarkedBy:{type:ObjectId
    ,ref:"user"}
},{timestamps:true},
{
    toJSON: { virtuals: true }
}
)

bookmarkSchema.virtual("frompost", {
    ref:'post',
    localField:'postedId',
    foreignField:"_id",
    justOne:true
})
bookmarkSchema.virtual("fromuser", {
    ref:'user',
    localField:'bookmarkedBy',
    foreignField:"_id",
    justOne:true
})
module.exports = mongoose.model("bookmark", bookmarkSchema);
