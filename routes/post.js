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

// get a single post
router.get('/:id', getPost, (req,res) => {
    res.json(res.post);
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
router.delete('/:id', getPost, async (req,res) => {
    try{
        await res.post.deleteOne();
        res.json({message:"deleted post"})
    }catch(err){
        res.status(500).json({message: err.message});
    }
})
// Modifying caption
router.patch('/:id',getPost, async (req,res) => {
    if(req.body.caption != null){
        res.post.caption = req.body.caption;
    }

    try{
        const updatedPost = await res.post.save();
        res.json(updatedPost);
    }catch(err){
        res.status(400).json({message: err.message});
    }
})

async function getPost(req, res, next) {
    let post;
    try{
        post = await Post.findById(req.params.id);
        if (post == null){
            return res.status(404).json({ message: 'Cannot find post'});
        }
    }catch (err){
        return res.status(500).json({ message: err.message });
    }

    res.post = post;
    next();
}

module.exports = router;

