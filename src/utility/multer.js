const multer = require('multer');
const path = require('path'); // Import the path module

// Define storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Set the destination folder for uploaded files
        cb(null, path.join(__dirname, '../uploads/users'));
    },
    filename: (req, file, cb) => {
        // Set the filename for uploaded files
        cb(null, file.originalname);
    }
});

// Create Multer instance
const upload = multer({ storage: storage });

module.exports = upload;
