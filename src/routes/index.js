const express = require('express');
const router = express.Router();


//routes

//middlewares
const authVerifyMiddleware = require('../middlewares/authMiddleware');

//routes
const authRoute = require('../modules/Auth/controller');
const userRoute = require('../modules/User/controller');
router.use('/user', userRoute);

//EndPoint

router.use('/auth', authRoute);
router.use(authVerifyMiddleware);
module.exports = router;
