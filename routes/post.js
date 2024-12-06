const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Getting all posts
router.get('/', async (req,res) => {
    try{
        const post = await Post.find();
        res.json(post)
    } catch (err) {
        res.status(500).json({message: err.message});
    }
})

// Getting all posts of a single user
router.get('/:userid', (req,res) => {
    res.send(req.params.userid);
})

// Get a single post
router.get('/id', (req,res) => {
    
})

// Creating a post logged in as a user
router.post('/', async (req,res) => {
    const post = new Post({
        ownerId: req.body.ownerId,
        content: req.body.content,
        comments: req.body.comments,
        caption: req.body.caption,
        date: req.body.date,
        likedBy: req.body.likedBy
    });

    try{
        const newPost = await post.save();
        res.status(201).json(newPost);
    }catch (err) {
        res.status(400).json({message: err.message});
    }
})
// Deleting a post in you postHistory
router.delete('/:id', (req,res) => {
    
})
// Adding a comment to a post
router.patch('/', (req,res) => {
    
})
// 

module.exports = router;

