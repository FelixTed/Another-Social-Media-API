const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
    ownerId: {type: mongoose.Schema.Types.ObjectId, required:true},
    content: {type:String, required:true},
    date: {type:Date,default:Date.now}
});

const Story = new mongoose.model('Story', storySchema);
module.exports = Story;