const express = require('express');
const router = express.Router();
const Message = require('../models/Message');


// Getting all messages, for testing purposes
router.get('/', async (req,res) => {
    try{
        const message = await Message.find();
        res.json(message);
    }catch(err){
        res.status(500).json({message:err.message});
    }
});

// Get a single message
router.get('/:id', getMessage, async (req,res) =>{
    res.json(res.message);
});

// Deleting a message
router.delete('/:id', getMessage, async (req,res) =>{
    try{
        await res.message.deleteOne();
        res.json({message:'deleted message'});
    }catch(err){
        res.status(500).json({message:err.message});
    }
});

// Uploading a message
router.post('/', async (req,res) => {
    const message = new Message({
        ownerId: req.body.ownerId,
        content: req.body.content,
        attached: req.body.attached,
        chatId: req.body.chatId,
        date: req.body.date
    })
    try{
        const newMessage = await message.save();
        res.status(201).json(newMessage);
    }catch(err){
        res.status(400).json({message:err.message});
    }
});

async function getMessage(req,res,next){
    let message;
    try{
        message = await Message.findById(req.params.id);
        if(message == null){
            return res.status(400).json({message:'object not found'});
        }
    }catch(err){
        return res.status(500).json({message: err.message});
    }

    res.message = message;
    next();
}

module.exports = router;