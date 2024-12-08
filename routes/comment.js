const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

// Get all comments. Only for testing purposes
router.get('/', async (req, res) => {
    try{
        const comment = await Comment.find();
        res.json(comment)
    } catch (err) {
        res.status(500).json({message: err.message});
    }
})

// Get a single comment
router.get('/:id',getComment, async (req,res) =>{
    res.json(res.comment);
});

// Creating a comment
router.post('/', async(req,res) => {
    const comment = new Comment({
        ownerId: req.body.ownerId,
        postId: req.body.postId,
        content: req.body.content
    });

    try{
        const newComment = await comment.save();
        res.status(201).json(newComment);
    }catch (err){
        res.status(400).json({message: err.message});
    }
});

// Deleting a comment
router.delete('/:id', getComment, async (req,res) =>{
    try{
        await res.comment.deleteOne();
        res.json({message: "deleted post"});
    }catch(err){   
        res.status(500).json({message: err.message});
    }
});

// Cannot update a comment

// Helper function to find a single comment
async function getComment(req, res, next){
    let comment;
    try{
        comment = await Comment.findById(req.params.id);
        if (comment == null){
            return res.status(404).json({message: 'Cannot find post'});
        }
    } catch(err){
        return res.status(500).json({message:err.message});
    }

    res.comment = comment;
    next();
}

module.exports = router;