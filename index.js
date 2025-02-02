require('dotenv').config();
const mongoose = require('mongoose');
const { type } = require('os');
const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();


const uri = process.env.URI;
// const corsOptions = {
//   origin: 'https://another-social-media-app.onrender.com',
//   methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// };

// app.use(cors(corsOptions));
// app.options('*', cors(corsOptions));
const corsOptions = {
  origin: ['https://another-social-media-app.onrender.com',"http://127.0.0.1:59014"],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Content-Type-Options', 'Accept', 'X-Requested-With', 'Origin'],
  credentials: true,
  maxAge: 7200
};

app.use(cors(corsOptions));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
