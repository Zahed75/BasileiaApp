// const asyncHandler = (func) => (req, res, next) => {
//     Promise.resolve(func(req, res, next)).catch(next);
//   };
  
//   const generateUserNameFromEmail = (email) => {
//     let username = email.split('@')[0];
//     username = username.replace(/|./g, '');
//     return username;
//   };
  
//   module.exports = {
//     asyncHandler,
//     generateUserNameFromEmail
//   };
  