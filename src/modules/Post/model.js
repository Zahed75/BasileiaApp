const mongoose = require('mongoose');

const UploadSchema = new mongoose.Schema({
    user: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        }
    }],
    files: {
        type: String,
        required: true,
    },
    like: {
        type: Number,
        default: 0
    },
    comments: {
        type: String,
        max: [500, "Your comments must be at least 500 characters"]
    },
    shares: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const FileUpload = mongoose.model('files', UploadSchema);

module.exports = FileUpload;
