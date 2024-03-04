const multer = require('multer');
const { BadRequest, NotFound } = require('../../utility/errors');
const User=require('../User/model');
const QuestionModel=require('../church/model');
const mongoose = require('mongoose');




//add Question

const addQuestion=async(questions)=>{
    const newQuestion=await QuestionModel.create(questions);
    return newQuestion;
}



module.exports = {

    addQuestion,
  
};
