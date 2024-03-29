const express = require('express');
const router = express.Router();
require('dotenv').config();
const handleValidation = require('../../middlewares/schemaValidation');

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
const { asyncHandler } = require('../../utility/common');


//passportJs

require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;



const userSignup = async (req, res, next) => {
  try {
    const user = await authService.registerUser(req.body);

    res.status(201).json({
      email: user.email,
      user,
      message: 'OTP is sent to your email. Please Check your email',
    });
  } catch (err) {
    next(err, req, res);
  }
};


//user signin

const userSignin = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await authService.signinUser(
      req.body
    );

    res.cookie('currentUserRole', user.role, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });


    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      accessToken,
      user,
      message: 'User logged in successfully',
    });
  } catch (err) {
    next(err, req, res);
  }
};



const logoutHandler = async (req, res, next) => {
  try {
    const isUser = await authService.findUserByCookie(req.cookies);
    if (!isUser) {
      res.clearCookie('jwt', { httpOnly: true });
      res.clearCookie('currentUserRole', { httpOnly: true });
      return res.sendStatus(204);
    }
    await authService.removeRefreshToken(isUser.refreshToken);
    res.clearCookie('jwt', { httpOnly: true });
    res.clearCookie('currentUserRole', { httpOnly: true });

    res.sendStatus(204);
  } catch (err) {
    next(err, req, res);
  }
};


// Verify OTP

const verifyOTP = async (req, res, next) => {
  try {
    await authService.otpVerification(req.body);

    res.status(200).json({
      message: 'Verification successfull',
    });
  } catch (err) {
    next(err, req, res);
  }
};




const resendOTP = async (req, res, next) => {
  try {
    await authService.resendOtp(req.body);

    res.status(200).json({
      message: 'OTP resent to your email',
    });
  } catch (err) {
    next(err, req, res);
  }
};

const expireOTP = async (req, res, next) => {
  try {
    await authService.expireOTP(req.body);

    res.status(200).json({
      message: 'OTP expired',
    });
  } catch (err) {
    next(err, req, res);
  }
};

const refreshTokenHandler = async (req, res, next) => {
  try {
    const { accessToken, refreshToken } = await authService.getAccessToken(
      req.cookies,
      res.clearCookie('jwt', { httpOnly: true })
    );

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ accessToken });
  } catch (err) {
    console.log({ err });
    next(err, req, res);
  }
};

// getUserInfo By UserID

const getUserInfoByIdHandler = async (req, res, next) => {
  try {
    
      const { userId } = req.params;
      const user = await authService.getUserInfoById(userId);
      res.status(200).json({ user });
  } catch (err) {
      next(err, req, res);
  }
}

//UpdateUserProfileById


const updateUserProfileHandler = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const updates = req.body; // Assuming updates are sent in the request body
    const profilePicture = req.file ? req.file.path : null; // Assuming the profile picture is uploaded as a file
    
    const updatedUser = await authService.updateUserProfileById (userId, updates, profilePicture);
    
    // Check if the user was updated successfully
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.status(200).json({ user: updatedUser });
  } catch (error) {
    // Pass the error to the error handling middleware
    next(error);
  }
};







// GetAllUsers
const getAllUsersHandler = async (req, res) => {
  try {
    const allUsers = await authService.getAllUsers();
    res.status(200).json({
      message: "Get All Users Fetched successfully",
      allUsers
    });
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


// delete UserController

const deleteUserHandler=asyncHandler(async (req, res, next) => {

  const {id}=req.params;
  const Users=await authService.deleteUser(id,req.body);
  res.status(200).json({
    message:"Delete User Successfully",
    Users
  })
})


//reset PasswordController

const resetPasswordHandler = async (req, res) => {
  try {
      const { email, newPassword } = req.body;
      const result = await authService.resetPassword(email, newPassword);
      res.status(200).json(result);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};








router.post('/admin/register', handleValidation(adminValidate), userSignup);
router.post('/user/signin', userSignin);
router.get('/logout', logoutHandler);
router.get("/getAllUsers",getAllUsersHandler);
router.post('/otp/verify', verifyOTP);
router.post('/otp/resend', resendOTP);
router.post('/otp/expire', expireOTP);
router.get('/refresh', refreshTokenHandler);
router.get('/:userId',getUserInfoByIdHandler);
router.post('/updateUserProfiler/:userId',updateUserProfileHandler);
router.delete('/:id',deleteUserHandler);
router.post('/reset-password', resetPasswordHandler);

module.exports = router;
