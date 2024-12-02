const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    usersIds: [{type:mongoose.Schema.Types.ObjectId, required:true}],
    messageIds: [{type:mongoose.Schema.Types.ObjectId, required:true}],
    title: {type:String, default: ''}
});

const Chat = new mongoose.model('Chat', chatSchema);
module.exports = Chat;