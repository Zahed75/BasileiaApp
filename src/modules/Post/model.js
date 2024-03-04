const mongoose = require('mongoose');


const ReplySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'User'
    },
    reply: {
        type: String,
        required: true,
        max: [500, "Reply must be at most 500 characters"]
    }
}, { timestamps: true });

const CommentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'User'
    },
    comment: {
        type: String,
        required: true,
        max: [500, "Comment must be at most 500 characters"]
    },
    replies: [ReplySchema]
}, { timestamps: true });




const UploadSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    
    files: {
        type: String,
        required: false,
    },


    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Assuming you have a User model
    }],

    shares: {
        type: Number,
        default: 0
    },
    following: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        default: [],
      },
      followers: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        default: [],
      },

    verse:{
        type:String,
        max: [500, "Your comments must be at least 500 characters"],
        required: false
    },
    comments: [CommentSchema]

}, { timestamps: true });

const FileUpload = mongoose.model('files', UploadSchema);

module.exports = FileUpload;
