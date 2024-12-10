const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');

// Getting all chats
router.get('/', async (req,res) => {
    try{    
        const chat = await Chat.find();
        res.json(chat);
    }catch(err){
        res.status(500).json({message:err.message});
    }
})

// Getting a single chat
router.get('/:id', getChat, async(req,res) => {
    res.json(res.chat);
})

// Deleting a chat
router.delete('/:id', getChat, async (req,res) =>{
    try{
        await res.chat.deleteOne();
        res.json({message:'deleted chat'});
    }catch(err){
        res.status(500).json({message: err.message});
    }
});

// Posting a chat
router.post('/', async (req,res) => {
    const chat = new Chat({
        usersIds: req.body.usersIds,
        messageIds: req.body.messageIds,
        title: req.body.title
    })

    try{
        const newChat = await chat.save();
        res.status(201).json(newChat);
    }catch(err){
        res.status(500).json({message:err.message});
    }
});

// Helper to get a single chat
async function getChat(req,res,next) {
    let chat;
    try{
        chat = await Chat.findById(req.params.id);
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