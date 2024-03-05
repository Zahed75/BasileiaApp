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


// getAllQueationByUserID

// getAllQueationByUserID
const getAllQuestionByUser = async (id) => {
    try {
        const questions = await QuestionModel.find({ userId: id }); // Construct the filter object
        return questions;
    } catch (err) {
        throw err;
    }
}




module.exports = {
    addQuestion,
   getAllQuestionByUser
  
};
