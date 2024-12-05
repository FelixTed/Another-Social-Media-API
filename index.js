require('dotenv').config();
const mongoose = require('mongoose');
const { type } = require('os');
const express = require('express');
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

const postRouter = require('./routes/post');
app.use('/post',postRouter)

app.listen(3000, () => console.log('Server started'));