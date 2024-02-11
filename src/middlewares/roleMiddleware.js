const { Unauthorized } = require('../utility/errors');
const { BASIC_USER,CELEBRITY_VIP } = require('../config/constants');
module.exports = (roles) => (req, res, next) => {
  if (!roles.includes(req.role) && !roles.includes(SUPER_ADMIN))
    throw new Unauthorized('You dont have permissions for this action');
  next();
};
