const express = require('express');
const router = express.Router();


//routes

//middlewares
const authVerifyMiddleware = require('../middlewares/authMiddleware');

//routes
const authRoute = require('../modules/Auth/controller');
const userRoute = require('../modules/User/controller');
const uploadRoute=require('../modules/Post/controller');
const questionRoute=require('../modules/church/controller');
//EndPoint

router.use('/auth', authRoute);
router.use('/user', userRoute);
router.use('/upload', uploadRoute);
router.use(authVerifyMiddleware);
router.use('/question',questionRoute);
module.exports = router;
