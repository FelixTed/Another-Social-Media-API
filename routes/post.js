const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Post = require('../models/Post');
const multer = require('multer');
const Grid = require('gridfs-stream');
const path = require('path');

// Getting all posts NOTE THIS IS ONLY FOR TESTING PURPOSES, DONT FORGET TO TAKE AWAY IF DEPLOYED
router.get('/', async (req,res) => {
    try{
        const posts = await Post.find();
        const updatedPosts = posts.map(post => {
            const postObject = post.toObject(); // Convert to plain object
            if (postObject.content) {
                postObject.imageUrl = `${req.protocol}://${req.get('host')}/${postObject.content}`;
            }
            return postObject;
        });
        res.json(updatedPosts);
    } catch (err) {
        res.status(500).json({message: err.message});
    }

})

const upload = multer({ dest:'uploads/'});


// Route to get a single post
router.get('/:id', getPost, (req, res) => {
    const post = res.post.toObject(); 

    if (post.content) {
        post.imageUrl = `${req.protocol}://${req.get('host')}/${post.content}`; 
    }

    res.json(post);
});

// Creating a post
router.post('/',upload.single('content'),async (req,res) => {

    const likedBy = JSON.parse(req.body.likedBy);
    const comments = JSON.parse(req.body.comments); 

    const post = new Post({
        ownerId: req.body.ownerId,
        content: req.file.path,
        comments: comments.map(id => new mongoose.Types.ObjectId(id)),
        caption: req.body.caption,
        date: req.body.date,
        likedBy: likedBy.map(id => new  mongoose.Types.ObjectId(id))
    });

    try{
        const newPost = await post.save();
        res.status(201).json(newPost);
    }catch (err) {
        res.status(400).json({message: err.message});
    }
})
// Deleting a post
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

// Helper to find a single post
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

