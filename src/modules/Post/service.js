const path = require('path');
const fileForge = require('express-fileforge');
const fileModel=require('../Post/model');

async function uploadFile(userId, file) {
    // Upload file
    let uploadedFile = await fileForge.saveFile(file, path.resolve(__dirname), 'uploads');

    // Create a new file entry in the database
    const fileUpload = new FileUploadModel({
        userId: userId,
        files: uploadedFile // Store the file path or filename in the database
    });

    // Save the file entry
    await fileUpload.save();

    return fileUpload;
}

module.exports = {
    uploadFile
};
