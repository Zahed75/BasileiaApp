require('dotenv').config({});
const jwt = require('jsonwebtoken');
const { Unauthorized } = require('../utility/errors');

module.exports = (req, res, next) => {
  let Token = req.headers['authorization'];
  
  if (!Token) {
    throw new Unauthorized('User not logged in');
  }

  Token = Token.split(' ')[1];

  console.log("Token Check", Token);

  jwt.verify(Token, process.env.AUTH_SECRET_KEY, function (err, decoded) {
    if (err) {
      throw new Unauthorized('Access Denied');
    } else {
      req.userid = decoded.userId;
      req.role = decoded.role;
      next();
    }
  });
};
