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



module.exports = {
    verseCreate,
    getAllPosts
};
