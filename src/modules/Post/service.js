const fileModel=require('../Post/model');
const multer = require('multer');
const { BadRequest, NotFound } = require('../../utility/errors');
const User=require('../User/model');
const mongoose = require('mongoose');

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

const getAllPosts = async (page, limit) => {
    const skip = (page - 1) * limit;
    const allPosts = await fileModel.find()
                                    .sort({ votes: 1, _id: 1 })
                                    .skip(skip)
                                    .limit(limit);
    return allPosts;
}




// getAllPostBy User ID


const getAllPostsByUserId= async(userId)=>{
    try {
        const posts = await fileModel.find({ userId }).populate('caption.userId','files.userId'); // Assuming 'username' is the field you want to populate from the 'User' model
        return posts;
    } catch (error) {
        throw error;
    }
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

// add Like Post

const likePost = async (uploadId, userId) => {
    try {
        const upload = await fileModel.findById(uploadId);
        if (!upload) {
            throw new Error('Upload not found');
        }

        if (upload.likes.includes(userId)) {
            throw new Error('You have already liked this post');
        }

        upload.likes.push(userId);
        await upload.save();

        // Returning updated likes array
        return upload.likes;
    } catch (error) {
        throw new Error(error.message);
    }
}



//getTotal Like of a POST

const getTotalLikes=async(uploadId)=>{
    {
        try {
            const upload = await fileModel.findById(uploadId);
            if (!upload) {
                throw new Error('Upload not found');
            }
    
            return upload.likes.length;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}






// Follow User
const followUser = async (followerId, followingId) => {
    try {
      // Update User model
      const follower = await User.findByIdAndUpdate(followerId, {
        $addToSet: { following: followingId },
      }, { new: true }); // Ensures updated document is returned
  
      if (!follower) {
        throw new Error('Follower not found');
      }
  
      await follower.save(); // Explicitly save follower document
  
      const following = await User.findByIdAndUpdate(followingId, {
        $addToSet: { followers: followerId },
      }, { new: true });
  
      if (!following) {
        throw new Error('Following user not found');
      }
  
      await following.save(); // Explicitly save following document
  
      // Update Post model (for following user's posts)
      const followingPosts = await fileModel.updateMany({ userId: followingId }, {
        $addToSet: { followers: followerId }
      });
      if (followingPosts.nModified === 0) {
        console.warn('No posts found for following user');
      }
  
      // Update Post model (for follower user's posts)
      const followerPosts = await fileModel.updateMany({ userId: followerId }, {
        $addToSet: { following: followingId }
      });
      if (followerPosts.nModified === 0) {
        console.warn('No posts found for follower user');
      }
  
      return { message: 'User followed successfully' };
    } catch (error) {
      console.error(error);
      if (error.name === 'MongoError') { // Check for specific database errors
        throw new Error('Failed to update user data');
      } else {
        throw new Error('Failed to create following relationship');
      }
    }
  };




// getTotalFollowers byUserId

const getTotalFollowers = async (postId) => { // Change to postId
    try {
        const post = await fileModel.findById(postId); // Fetch the Post document
        if (!post) {
            return { totalFollowers: 0 };
        }
        const followersCount = post.followers ? post.followers.length : 0;

        console.log("followers",followersCount);
        return { totalFollowers: followersCount };
    } catch (error) {
        // Handle errors
    }
};



//getTotal Following 

const getTotalFollowing=async(userId)=>{
    {
        try {
            const user = await User.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
    
            return user.following.length;
        } catch (error) {
            throw new Error(error.message);
        }
    }
    
}



// getTotalPostCound

const getTotalPostsByUserId=async(userId)=>{
    try {
        const totalPosts = await fileModel.countDocuments({ userId });
        return totalPosts;
    } catch (error) {
        throw error;
    }
}


// getTotalFollowers

const getAllFollowersByUserId=async(userId)=>{
    try {
        const user = await User.findById(userId).populate('followers', 'username'); // Assuming 'followers' is the field in the User model containing follower IDs
        return user.followers;
    } catch (error) {
        throw error;
    }
}




module.exports = {
    verseCreate,
    getAllPosts,
    addComment,
    addReply,
    likePost,
    getTotalLikes,
    followUser,
    getTotalFollowers,
    getTotalFollowing,
    getAllPostsByUserId,
    getTotalPostsByUserId,
    getAllFollowersByUserId
  
};
