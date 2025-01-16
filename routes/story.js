const express = require('express');
const router = express.Router();
const Story = require('../models/Story');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary');
const cron = require('node-cron');

const storage = multer.memoryStorage();
const upload = multer({ storage });


cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
  secure: true,
});
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

// const upload = multer({ dest:'storyUploads/'});

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

    // Upload image to Cloudinary directly from memory
        const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.v2.uploader.upload_stream(
            { folder: 'stories' }, 
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
            );
            stream.end(req.file.buffer);
        });


    const story = new Story({
        ownerId: req.body.ownerId,
        content: uploadResult.secure_url,
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

         if(filePath){
                                
            const cloudinaryUrl = filePath;
            const publicId = cloudinaryUrl
            .split('/')
            .slice(-2) 
            .join('/')
            .replace(/\.[^/.]+$/, '');

            // Delete the image from Cloudinary
            await cloudinary.v2.uploader.destroy(publicId);
        }
        res.json({message: 'Deleted Story'});
    }catch(err){
        res.status(500).json({message:err.message});
    }
})

// 7 days
const timeLimitInMs = 24 * 60 * 60 * 1000 * 7; 
// Run every sunday at midnight
cron.schedule('0 0 * * 0', async () => {
    const now = new Date();
    const result = await db.collection('stories').deleteMany({
        date: { $lt: new Date(now - timeLimitInMs) }
    });

    console.log(`Deleted ${result.deletedCount} expired stories.`);
});


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