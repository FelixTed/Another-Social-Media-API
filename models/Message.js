const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    ownerId: {type:mongoose.Schema.Types.ObjectId,ref:'User', required:true},
    content: {type:String, default:''},
    attached: {type:String, default:''},
    chatId: {type:mongoose.Schema.Types.ObjectId, ref: 'Chat', required:true},
    date: {type: Date, default: Date.now}
});

const Message = new mongoose.model('Message',messageSchema);
module.exports = Message;