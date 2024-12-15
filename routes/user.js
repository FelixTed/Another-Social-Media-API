const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const User = require('../models/User');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Getting all users
router.get('/', async (req,res) => {
    try{
        const users = await User.find();
        const updatedUsers = users.map(user => {
            const userObject = user.toObject();
            if (userObject.profilePic){
                userObject.imageUrl = `${req.protocol}://${req.get('host')}/${userObject.profilePic}`;
            }
            return userObject;
        });
        res.json(updatedUsers);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

const upload = multer({dest:'profilePicUploads/'});

// Getting an user
router.get('/:id',getUser,  async (req,res) =>{
    const user = res.user.toObject();

    if(user.profilePic){
        user.imageUrl = `${req.protocol}://${req.get('host')}/${user.profilePic}`
    }

    res.json(res.user);
});

// Deleting an user
router.delete('/:id', getUser, async (req,res) => {
    try{

        const filePath = res.user.profilePic;

        await res.user.deleteOne();

        if(filePath && "profilePicUploads\\basicPic.png" != filePath){
            fs.unlink(path.resolve(filePath), (err) => {
                if (err) {
                    console.error("Error deleting the file:", err.message);
                } else {
                    console.log("File successfully deleted");
                }
            });
        }

        res.json({message:"deleted user"});
    } catch(err) {
        res.status(500).json({message: err.message});
    }
});

// Updating a user (only allows to update one at a time)
router.patch('/:id',upload.single('profilePic'), getUser, async (req,res) => {
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
    }else if(req.file && req.file.path){
        const filePath = res.user.profilePic;
        if(filePath && "profilePicUploads\\basicPic.png" != filePath){
            fs.unlink(path.resolve(filePath), (err) => {
                if (err) {
                    console.error("Error deleting the file:", err.message);
                } else {
                    console.log("File successfully deleted");
                }
            });
        }
        res.user.profilePic = req.file.path;
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
router.post('/', upload.single('profilePic'),async (req, res) => {

    const following = JSON.parse(req.body.following);
    const followers = JSON.parse(req.body.followers);
    const postHistory = JSON.parse(req.body.postHistory);
    const stories = JSON.parse(req.body.stories);
    const chats = JSON.parse(req.body.chats);

    const user = new User({
    following: following.map(id => new mongoose.Types.ObjectId(id)),
    followers: followers.map(id => new mongoose.Types.ObjectId(id)),
    postHistory: postHistory.map(id => new mongoose.Types.ObjectId(id)),
    name: req.body.name,
    profilePic: req.file?.path || null,
    bio: req.body.bio,
    stories: stories.map(id => new mongoose.Types.ObjectId(id)),
    chats: chats.map(id => new mongoose.Types.ObjectId(id)),
    password: req.body.password
    });
    try{
        if (user.profilePic === null){
            user.profilePic = "profilePicUploads\\basicPic.png";
        }
        const newUser = await user.save();
        res.status(201).json(newUser);
    }catch (err) {
        const filePath = user.profilePic;

        if(filePath && "profilePicUploads\\basicPic.png" != filePath){
            fs.unlink(path.resolve(filePath), (err) => {
                if (err) {
                    console.error("Error deleting the file:", err.message);
                } else {
                    console.log("File successfully deleted");
                }
            });
        }
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