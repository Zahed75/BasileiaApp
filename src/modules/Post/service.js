const fileModel=require('../Post/model');
const multer = require('multer');
const { BadRequest, NotFound } = require('../../utility/errors');
const User=require('../User/model');


//Verse Create



const verseCreate = async (userId, data) => {
    try {
        // Create the verse
        const newVerse = await fileModel.create(data);

        // Add the verse to the user's posts
        await User.findByIdAndUpdate(userId, {
            $push: {
                posts: newVerse._id, // Assuming the posts field in the user model is an array of verse IDs
            }
        });

        return newVerse;
    } catch (error) {
        throw new Error(error);
    }
};


// Get all Post all users

const getAllPosts=async(query)=>{
    const allPosts=await fileModel.find().sort({votes:1,_id:1})
    return allPosts;
}




// comment any Post With


const addComment=async(uploadId, userId, comment)=>{
    try {
        const upload = await fileModel.findById(uploadId);
        if (!upload) {
            throw new Error('Upload not found');
        }
        
        upload.comments.push({ userId, comment });
        await upload.save();

        return upload;
    } catch (error) {
        throw new Error(error.message);
    }
}


//add Reply to any Post

const addReply=async(uploadId, commentId, userId, reply)=>{
    {
        try {
            const upload = await fileModel.findById(uploadId);
            if (!upload) {
                throw new Error('Upload not found');
            }
    
            const comment = upload.comments.find(comment => comment._id == commentId);
            if (!comment) {
                throw new Error('Comment not found');
            }
    
            comment.replies.push({ userId, reply });
            await upload.save();
    
            return upload;
        } catch (error) {
            throw new Error(error.message);
        }
    }
    
}


module.exports = {
    verseCreate,
    getAllPosts,
    addComment,
    addReply
};
