const express = require('express');
const router = express.Router();

router.get('/', (req,res) => {
    res.send('Hello World');
})

// Getting all posts of a single user
router.get('/:userid', (req,res) => {
    res.send(req.params.userid)
})

// Get a single post
router.get('/id', (req,res) => {
    
})

// Creating a post logged in as a user
router.post('/', (req,res) => {
    
})
// Deleting a post in you postHistory
router.delete('/:id', (req,res) => {
    
})
// Adding a comment to a post
router.patch('/', (req,res) => {
    
})
// 

module.exports = router;

