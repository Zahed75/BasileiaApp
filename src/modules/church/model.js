const mongoose = require('mongoose');

const ReplySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    reply: {
        type: String,
        required: true,
        maxlength: [500, "Reply must be at most 500 characters"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const CommentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    comment: {
        type: String,
        required: true,
        maxlength: [500, "Comment must be at most 500 characters"]
    },
    replies: [ReplySchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const CommunitySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'User'
    },
    question: {
        type: String,
        required: true
    },
   
    categories:{
        type:String,
        //GN-> GENERAL
        //BL -> Bible
        // QS -> Question
        // MT -> MOtivation
        enum:['GEN','BL','QS','MT'],
        require:[true,'Category Must Be Required']
    },
    upvotes: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }],
    comments: [CommentSchema],

    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Community = mongoose.model('Community', CommunitySchema);

module.exports = Community;



