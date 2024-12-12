const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    ownerId: {type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    content: {type: mongoose.Schema.Types.ObjectId},
    comments: [{type:mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
    caption: {type:String, default:''}, 
    date: {type:Date, defaut:Date.now},
    likedBy: [{type:mongoose.Schema.Types.ObjectId, ref:'User'}]
});

const Post = new mongoose.model('Post',postSchema);
module.exports = Post;