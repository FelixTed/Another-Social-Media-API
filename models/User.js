const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    following: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    followers: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    postHistory: [{type: mongoose.Schema.Types.ObjectId, ref: 'Post'}],
    name: {type: String, required: true, unique:true},
    profilePic: {type: String, default:''},
    bio: {type:String, default:''},
    stories: [{type: mongoose.Schema.Types.ObjectId, ref: 'Story'}],
    chats: [{type: mongoose.Schema.Types.ObjectId, ref: 'Chat'}]
});

const User = new mongoose.model('User', userSchema);
module.exports = User;
