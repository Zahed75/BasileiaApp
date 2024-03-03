const express = require('express');
const router = express.Router();

const PostService=require('./service');
const User = require('../User/model');
const { ObjectId } = require('mongoose').Types;
const {
    BASIC_USER,
    CELEBRITY_VIP,
    CHRUCH_LEADER,
    CHRUCH_PAGE,
    SUPER_ADMIN
   
   }=require('../../config/constants');

const authService = require('./service');
const { adminValidate } = require('./request');
const roleMiddleware = require('../../middlewares/roleMiddleware');
const authMiddleware = require('../../middlewares/authMiddleware');

const fileModel=require('../Post/model');
const fileForge = require('express-fileforge');
const path = require('path');

const uploadFiles = require('../../utility/multer');
const mongoose = require('mongoose');




const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Extract userId from request body
        const { userId } = req.body;

        // Validate userId (you can skip this if userId is always valid)
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).json({ error: 'Invalid userId' });
        }

        // Get the filename of the uploaded file
        const fileName = req.file.filename;

        // Check if userId is provided
        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }

        // Create a new file entry in the database
        const newFile = new fileModel({
            userId: new mongoose.Types.ObjectId(userId), // Instantiate ObjectId with new
            files: fileName,
            // You can add other fields as needed
        });

        // Save the file entry to the database
        await newFile.save();

        res.json({ message: 'File uploaded successfully', file: newFile });
    } catch (error) {
        console.error('Error saving file:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



// VerseCreate


const createVerse = async (req, res, next) => {
    try {
        const userId = req.body.userId; // Assuming the user ID is provided in the request body
        const verseData = req.body; // Assuming the verse data is provided in the request body

        const verse = await PostService.verseCreate(userId, verseData);
        res.status(200).json({
            message: "Verse created successfully",
            verse
        });
    } catch (error) {
        next(error);
    }
};


// Get All Posts handler
const getAllPostsHandler=async (req, res, next) => {
    const postAll=await PostService.getAllPosts();
    res.status(200).json({
        message:"Post Fetched Successfully!",
        postAll
    })
}


//addComment Handler

const addCommentHandler=async(req, res)=>{
    {
        try {
            const { userId, comment } = req.body;
            const uploadId = req.params.uploadId;
    
            const upload = await PostService.addComment(uploadId, userId, comment);
    
            res.status(201).json({ message: 'Comment added successfully', upload });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}


// addReply Handler

const addReplyHandler=async(req, res)=>{
    {
        try {
            const { userId, reply } = req.body;
            const { uploadId, commentId } = req.params;
    
            const upload = await PostService.addReply(uploadId, commentId, userId, reply);
    
            res.status(201).json({ message: 'Reply added successfully', upload });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    
}


//LikePost Handler

const likePostHandler = async (req, res) => {
    try {
        const { userId } = req.body;
        const uploadId = req.params.uploadId;

        const updatedLikes = await PostService.likePost(uploadId, userId);

        res.status(200).json({ message: 'Post liked successfully', likes: updatedLikes });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}



//getTotal LikesHandler

const getTotalLikesHandler=async(req, res)=>{
    {
        try {
            const uploadId = req.params.uploadId;
    
            const likesCount = await PostService.getTotalLikes(uploadId);
    
            res.status(200).json({ likes: likesCount });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}



// addFollowers

const followUserHandler = async (req, res) => {
    try {
      const { followerId, followingId } = req.body;
  
      const result = await PostService.followUser(followerId, followingId);
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message }); // Use specific error messages
    }
  };




// Total Followers

const getTotalFollowers = async (req, res) => {
    try {
        const { postId } = req.params; // Extract postId from request parameters

        const totalFollowers = await PostService.getTotalFollowers(postId);

        res.status(200).json(totalFollowers);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' }); // Generic error for unexpected issues
    }
};


//Following Users

const getTotalFollowing=async(req, res)=>{
    {
        try {
            const userId = req.params.userId;
            const totalFollowing = await PostService.getTotalFollowing(userId);
            res.status(200).json({ totalFollowing });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}






router.post('/fileSystem', uploadFiles.single('files'), uploadFile);
router.post('/addVerse',createVerse);
router.get('/postGetAll',getAllPostsHandler);

router.post('/comment/:uploadId',addCommentHandler);
router.post('/reply/:uploadId/:commentId', addReplyHandler);

router.post('/likePost/:uploadId', likePostHandler);
router.get('/likesTotal/:uploadId', getTotalLikesHandler);

router.post('/follow', followUserHandler);

router.get('/:postId/followers', getTotalFollowers);

router.get('/following/:userId', getTotalFollowing);



module.exports = router; 