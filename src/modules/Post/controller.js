const express = require('express');
const router = express.Router();

const PostService=require('./service');
const User = require('../User/model');

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

const uploadFile = (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const uploadedFile = req.file;
        const fileName = uploadedFile.originalname;
        res.json({ message: 'File uploaded successfully', fileName: fileName });
    } catch (error) {
        console.error('Error saving file:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

router.post('/fileSystem', uploadFiles.single('files'), uploadFile);

module.exports = router;