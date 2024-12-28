require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const User = require('../models/User');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

// Getting all users
router.get('/', async (req,res) => {
    try{
        const users = await User.find();
        const updatedUsers = users.map(user => {
            const userObject = user.toObject();
            if (userObject.profilePic){
                userObject.imageUrl = `http://localhost:3000/${userObject.profilePic}`;
            }
            return userObject;
        });
        res.json(updatedUsers);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

// Searching for a user
router.get('/search/:searchTerm', async (req,res) => {
    try{
        searchTerm = req.params.searchTerm || '';
        const users = await User.find({
            name: {$regex: searchTerm, $options: 'i'}
        }).lean();
        
        users.forEach(user => {
            if(user.profilePic){
                user.imageUrl = `http://localhost:3000/${user.profilePic}`;
            }
        });
        
        res.status(200).json(users);
    } catch(error){
        res.status(500).json({'error': error.message}); 
    }
});

const upload = multer({dest:'profilePicUploads/'});

// Getting an user
router.get('/:id',getUser,  async (req,res) =>{
    const user = res.user.toObject();

    if(user.profilePic){
        user.imageUrl = `http://localhost:3000/${user.profilePic}`
    }

    res.json(user);
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
    try{
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
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

        if (user.profilePic === null){
            user.profilePic = "profilePicUploads\\basicPic.png";
        }
        const newUser = await user.save();
        res.status(201).json({'user':newUser, 'token':token});
    }catch (err) {
        if(typeof user !== 'undefined'){
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
        }
        if(err.code === 11000){
            return res.status(400).json({message:'Name already in use. Please choose another.'});
        }

        res.status(500).json({message: err.message});
    }
});

router.post('/login', async (req, res) => {
    const { name, password } = req.body;

    try {
        const user = await User.findOne({ name });
        if (!user) return res.status(404).json({ message: 'User not found' });
        console.log(user.password);
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect)
            return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});


const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    try {
        const decoded = jwt.verify(token, 'your_secret_key');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid token' });
    }
};


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