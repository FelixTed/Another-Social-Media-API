const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Getting all users
router.get('/', async (req,res) => {
    try{
        const user = await User.find();
        res.json(user)
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

// Getting an user
router.get('/:id',getUser,  async (req,res) =>{
    res.json(res.user);
});

// Deleting an user
router.delete('/:id', getUser, async (req,res) => {
    try{
        await res.user.deleteOne();
        res.json({message:"deleted user"});
    } catch(err) {
        res.status(500).json({message: err.message});
    }
});

// Updating a user (only allows to update one at a time)
router.patch('/:id', getUser, async (req,res) => {
    if (req.body.following != null){
        // Unfollow if already following else follow
        if (res.user.following.includes(req.body.following))
            res.user.following.pull(req.body.following);
        else
            res.user.following.push(req.body.following);
    }else if(req.body.followers != null){
        // Unfollow if already in followers else follow
        if (res.user.followers.includes(req.body.followers))
            res.user.followers.pull(req.body.followers);
        else
            res.user.followers.push(req.body.followers);
    }else if(req.body.postHistory != null){
        // pull post if already in postHistory else add
        if (res.user.postHistory.includes(req.body.postHistory))
            res.user.postHistory.pull(req.body.postHistory);
        else
            res.user.postHistory.push(req.body.postHistory);
    }else if(req.body.name != null){
        res.user.name = req.body.name;
    }else if(req.body.profilePic != null){
        res.user.profilePic = req.body.profilePic;
    }else if(req.body.bio != null){
        res.user.bio = req.body.bio;
    }else if(req.body.stories != null){
        // pull story if already in stories else add
        if (res.user.stories.includes(req.body.stories))
            res.user.stories.pull(req.body.stories);
        else
            res.user.stories.push(req.body.stories);
    }else if(req.body.chats != null){
        // pull chat if already in chats else add
        if (res.user.chats.includes(req.body.chats))
            res.user.chats.pull(req.body.chats);
        else
            res.user.chats.push(req.body.chats);
    }else if(req.body.password != null){
        res.user.password = req.body.password;
    }

    try{
        const updatedUser = await res.user.save();
        res.json(updatedUser);
    }catch(err){
        res.status(400).json({message: err.message});
    }
})

// Adding an user
router.post('/', async (req, res) => {
    const user = new User({
    following: req.body.following,
    followers: req.body.followers,
    postHistory: req.body.postHistory,
    name: req.body.name,
    profilePic: req.body.profilePic,
    bio: req.body.bio,
    stories: req.body.stories,
    chats: req.body.chats,
    password: req.body.password
    });
    try{
        const newUser = await user.save();
        res.status(201).json(newUser);
    }catch (err) {
        res.status(400).json({message: err.message});
    }
});

// Helper to find a single user
async function getUser(req, res, next) {
    let user;
    try{
        user = await User.findById(req.params.id);
        if (user == null){
            return res.status(404).json({ message: 'Cannot find user'});
        }
    }catch (err){
        return res.status(500).json({ message: err.message });
    }

    res.user = user;
    next();
}

module.exports = router;