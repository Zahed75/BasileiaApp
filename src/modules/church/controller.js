const express = require('express');
const router = express.Router();

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
const questionService=require('../church/service');


// AddQuestionHandler

const addQuestionHandler =asyncHandler(async(req,res)=>{
    const question=await questionService.addQuestion(req.body);
    res.status(200).json({message:"Question Added successfully",question});
})






router.post('/questionAdd',addQuestionHandler);


module.exports = router;
