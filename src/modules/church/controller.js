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
const QuestionModel=require('../church/model');
// AddQuestionHandler

const addQuestionHandler =asyncHandler(async(req,res)=>{
    const question=await questionService.addQuestion(req.body);
    res.status(200).json({message:"Question Added successfully",question});
})


//getAllQuestionByID


const getAllQuestionByIdHandler=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    const questions=await questionService.getAllQuestionByUser(id);
    res.status(200).json({
        message:"Question fetched SuccessFully",
        questions
    })
})
   

// getLatestQuestion



const getLatestQuestionsHandler = async (req, res) => {
    try {
      // Call the service function to fetch all users' latest questions
      const latestQuestions = await questionService.getAllLatestQuestions();
  
      // Send the response with the fetched questions
      res.status(200).json({
        message: 'Fetched all users\' latest questions',
        latestQuestions
      });
    } catch (error) {
      // Handle errors
      console.error('Error fetching latest questions:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };


// addComments for question

const addCommentHandler = async (req, res) => {
    const { questionId } = req.params;
    const { userId, comment } = req.body;
    
    try {
        const question = await QuestionModel.findById(questionId);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        const newComment = {
            userId,
            comment
        };
        question.comments.push(newComment);
        await question.save();

        res.status(201).json({ message: 'Comment added successfully', comment: newComment });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



// reply Question
const replyToCommentHandler = async (req, res) => {
    const { questionId, commentId } = req.params;
    const { userId, reply } = req.body;
    
    try {
        const question = await QuestionModel.findById(questionId);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        const comment = question.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        const newReply = {
            userId,
            reply
        };
        comment.replies.push(newReply);
        await question.save();

        res.status(201).json({ message: 'Reply added successfully', reply: newReply });
    } catch (error) {
        console.error('Error adding reply:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


//Upvotes
const upvoteQuestionHandler = async (req, res) => {
    const { questionId } = req.params;
    const { userId } = req.body;
    
    try {
        const question = await QuestionModel.findById(questionId);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        // Check if the user already upvoted the question
        if (question.upvotes.includes(userId)) {
            return res.status(400).json({ message: 'User already upvoted this question' });
        }

        question.upvotes.push(userId);
        await question.save();

        res.status(200).json({ message: 'Question upvoted successfully' });
    } catch (error) {
        console.error('Error upvoting question:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



router.get('/latestQuestion',getLatestQuestionsHandler);
router.post('/questionAdd',addQuestionHandler);
router.get('/:id',getAllQuestionByIdHandler);
router.post('/:questionId/comments',addCommentHandler);
router.post('/:questionId/:commentId/replies',replyToCommentHandler);
router.post('/:questionId/upvote',upvoteQuestionHandler);


module.exports = router;
