const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    following: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    followers: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    postHistory: [{type: mongoose.Schema.Types.ObjectId, ref: 'Post'}],
    name: {type: String, required: true, unique:true, index:true},
    profilePic: {type: String, default:'profilePicUploads\\basicPic.png'},
    bio: {type:String, default:''},
    stories: [{type: mongoose.Schema.Types.ObjectId, ref: 'Story'}],
    chats: [{type: mongoose.Schema.Types.ObjectId, ref: 'Chat'}],
    password: {type: String, required:true}
});

userSchema.index({name:1});

// Hashing password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); 
    this.password = await bcrypt.hash(this.password, 10);
    next();
});
const User = new mongoose.model('User', userSchema);
module.exports = User;

