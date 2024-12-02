const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    ownerId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    postId: {type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true},
    content: {type:String,required:true}
});

const Comment = new mongoose.model('Comment', commentSchema);
module.exports = Comment;
