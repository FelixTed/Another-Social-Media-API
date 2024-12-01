require('dotenv').config();
const mongoose = require('mongoose');
const { type } = require('os');

const uri = process.env.URI;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Connected to MongoDB via Mongoose!");
})
.catch((err) => {
  console.error("Failed to connect to MongoDB:", err);
});
