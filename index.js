require('dotenv').config();
const mongoose = require('mongoose');
const { type } = require('os');
const express = require('express');
const path = require('path');
const app = express();

const uri = process.env.URI;

mongoose.connect(uri)
.then(() => {
  console.log("Connected to MongoDB via Mongoose!");
})
.catch((err) => {
  console.error("Failed to connect to MongoDB:", err);
});
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('database opened'));

app.use(express.json())

// Models
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const commentRouter = require('./routes/comment');
const storyRouter = require('./routes/story');
const chatRouter = require('./routes/chat');
const messageRouter = require('./routes/message');

// Routes
app.use('/post',postRouter);
app.use('/user', userRouter);
app.use('/comment', commentRouter);
app.use('/story', storyRouter);
app.use('/chat', chatRouter);
app.use('/message', messageRouter);

// Files
app.use('/postUploads', express.static(path.join(__dirname, 'postUploads')));
app.use('/profilePicUploads', express.static(path.join(__dirname, 'profilePicUploads')));
app.use('/storyUploads', express.static(path.join(__dirname, 'storyUploads')));

app.listen(3000, () => console.log('Server started'));