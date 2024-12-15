const express = require('express');
const router = express.Router();
const Story = require('../models/Story');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Getting all the stories only for testing purpose
router.get('/', async (req,res) => {
    try{
        const stories = await Story.find();
        const updatedStories = stories.map(story => {
            const storyObject  = story.toObject();
            if (storyObject.content) {
                storyObject.imageUrl = `${req.protocol}://${req.get('host')}/${storyObject.content}`;
            }
            return storyObject;
        });
        res.json(updatedStories);
    }catch(err){
        res.status(500).json({message:err.message});
    }
});

const upload = multer({ dest:'storyUploads/'});

// get a single story
router.get('/:id', getStory, async (req, res) =>{
    const story = res.story.toObject();

    if(story.content){
        story.imageUrl = `${req.protocol}://${req.get('host')}/${story.content}`; 
    }

    res.json(story);
})

// Create a story
router.post('/', upload.single('content'), async (req,res) => {
    const date = new Date();

    const story = new Story({
        ownerId: req.body.ownerId,
        content: req.file.path,
        date: date.toString()
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

        const filePath = res.story.content;

        await res.story.deleteOne();

        if (filePath) {
            fs.unlink(path.resolve(filePath),(err) => {
                if (err) {
                    console.error("Error deleting the file:", err.message);
                } else {
                    console.log("File successfully deleted");
                }
            });
        }
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