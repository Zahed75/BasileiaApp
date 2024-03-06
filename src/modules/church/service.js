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


// getLatestQuestion

const getAllLatestQuestions = async (userId = null) => {
    try {
      // Construct the query
      const query = userId ? { userId } : {};
      console.log(query);
  
      // Query the database to get all questions
      const questions = await QuestionModel.find(query)
        .sort({ createdAt: -1 }) // Sort by createdAt field in descending order
        .populate('userId', 'firstName lastName'); // Populate user details if needed
  
      return questions;
    } catch (error) {
      // Handle errors
      throw new Error('Error fetching questions: ' + error.message);
    }
  };
  



module.exports = {
    addQuestion,
    getAllQuestionByUser,
    getAllLatestQuestions


  
};
