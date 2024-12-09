const express = require('express');
const router = express.Router();
const Story = require('../models/Story');

// Getting all the stories only for testing purpose
router.get('/', async (req,res) => {
    try{
        const story = await Story.find();
        res.json(story);
    }catch(err){
        res.status(500).json({message:err.message});
    }
});

// get a single story
router.get('/:id', getStory, async (req, res) =>{
    res.json(res.story);
})

// Create a post
router.post('/', async (req,res) => {
    const story = new Story({
        ownerId: req.body.ownerId,
        content: req.body.content,
        date: req.body.date
    })

    try{
        const newStory = await story.save();
        res.status(201).json(newStory);
    }catch (err) {
        res.status(400).json({message: err.message});
    }
});

// Deleting a story
router.delete('/:id', getStory, async (req,res) => {
    try{
        await res.story.deleteOne();
        res.json({message: 'Deleted Story'});
    }catch(err){
        res.status(500).json({message:err.message});
    }
})


// Helper function to get a story
async function getStory(req,res,next){
    let story;
    try{
        story = await Story.findById(req.params.id);
        if(story == null){
            return res.status(404).json({message: 'Cannot find story'});
        }
    }catch(err){
        return res.status(500).json({message: err.message});
    }

    res.story = story;
    next();
}

module.exports = router;