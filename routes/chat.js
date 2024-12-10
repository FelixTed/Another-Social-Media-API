const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const Story = require('../models/Story');

// Getting all chats
router.get('/', async (req,res) => {
    try{    
        const chat = await Story.find();
        res.json(chat);
    }catch(err){
        res.status(500).json({message:err.message});
    }
})

// Getting a single chat
router.get('/:id', getChat, async(req,res) => {
    
})



// Helper to get a single chat
async function getChat(req,res,next) {
    let chat;
    try{
        chat = await Chat.findById(req.param.id);
        if(chat == null){
            return res.status(404).json({message:'Cannot find chat'});
        }
    }catch(err){
        return res.status(500).json({message: err.message});
    }

    res.chat = chat;
    next();
}

module.exports = router;