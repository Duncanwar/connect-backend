const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types
const privateChatSchema = new mongoose.Schema({
    user1:{type:ObjectId, ref:"user"},
    user2:{type:ObjectId, ref:"user"},
    messages:[{
        content: String,
        user:{type:ObjectId, ref:"user"},
        createdDate: {type:Date, default:Date.now()},
    }]
});
module.exports = mongoose.model("privateChatSchema", privateChatSchema);
