const jwt = require('jsonwebtoken');

const User = require('./model');

const {
  sendSetPasswordEmail,
  setPasswordEmailOutlet,
} = require('../../utility/email');
const { NotFound, BadRequest, Forbidden } = require('../../utility/errors');
const { BASIC_USER,
CELEBRITY_VIP,
CHRUCH_LEADER,
CHRUCH_PAGE,
SUPER_ADMIN,
 } = require('../../config/constants');
const { generateOTP } = require('../../utility/common');
const { SendEmailUtility } = require('../../utility/email');
const { all } = require('axios');

const addUser = async (user) => {
  const newUser = await User.create(user);
  return newUser;
};



const updateUser = async (userId, updatedValue) => {
  const updatedUser = await User.findByIdAndUpdate(
    {
      _id: userId,
    },
    updatedValue,
    {
      new: true,
    }
  );

  if (!updateUser) {
    throw new NotFound('User not found');
  }

  await Brand.updateMany(
    {
      ownerId: userId,
    },
    {
      ownerName: updatedUser.name,
    }
  );

  return updatedUser;
};



const deleteUserById = (userId) => {};

const getUsers = (limit, skip) => {};

const getUserById = async (id) => {
  const user = await User.findById({ _id: id });

  if (!user) throw new NotFound('User not found');

  return user;
};

const updateEmail = async (id, values) => {
  const { changedEmail } = values;
  const isUser = await User.findById({ _id: id });
  if (!isUser) throw new NotFound('User not found');

  const otp = generateOTP();

  isUser.emailChangeOTP = otp;
  isUser.changedEmail = changedEmail;

  isUser.emailChangeOTP = otp;
  isUser.changedEmail = changedEmail;

  await isUser.save();

  const emailBody = `Verification OTP: ${otp}`;
  await SendEmailUtility(changedEmail, emailBody, 'OTP');

  return isUser;
};

const verifyChangedEmail = async (id, otp) => {
  const isUser = await User.findById({ _id: id });

  if (!isUser) throw new NotFound('User not found');

  if (isUser.emailChangeOTP !== Number(otp))
    throw new BadRequest('Invalid OTP');

  const updatedUser = await User.findByIdAndUpdate(
    { _id: id },
    {
      $set: {
        email: isUser.changedEmail,
      },
      $unset: {
        changedEmail: 1,
        emailChangeOTP: 1,
      },
    },
    { new: true }
  ).select('name phoneNumber email password isActive isVerified role brands');

  return updatedUser;
};

// Create Brand Manager
const createBrandManager = async (userId, userData, profilePic) => {
  const { email, brands } = userData;

  if (!profilePic)
    throw new BadRequest('Please add a profile picture for brand manager');

  const emailExists = await User.findOne({
    email,
  });

  if (emailExists) {
    throw new BadRequest('User with this email already exists');
  }

  if (brands.length < 1) {
    throw new BadRequest('At least assign a brand');
  }

  const AllBrands = await Brand.find({
    _id: brands,
  });

  const allOutlets = await Outlet.find({
    brandId: brands,
  });

  const newUser = await User.create({
    ...userData,
    profilePic: profilePic.filename,
    ownerId: userId,
    creatorId: userId,
    brands: AllBrands,
    outlets: allOutlets,
  });

  sendSetPasswordEmail(newUser.email, newUser);
  return newUser;
};

// Admin Set Password
const updatePassword = async (id, body) => {
  const { currentPassword, newPassword, confirmPassword } = body;
  const user = await User.findById({ _id: id });
  if (!user) throw new NotFound('User not found');

  const isPassword = await user.authenticate(currentPassword);

  if (!isPassword) throw new BadRequest('Current password did not match');

  if (newPassword !== confirmPassword)
    throw new BadRequest('New password does not match');

  user.password = newPassword;

  await user.save();

  return user;
};

// Set Brand Manager Password
const setManagerPassword = async (data) => {
  const { password, token } = data;

  let userEmail;
  jwt.verify(token, process.env.AUTH_SECRET_KEY, async (err, decode) => {
    if (err) throw Forbidden('Invalid token');
    const { email } = decode;
    userEmail = email;
    const user = await User.findOne({ email });

    user.password = password;
    user.isVerified = true;
    user.isActive = true;

    await user.save();
  });

  return userEmail;
};

//for resending reset password email to managers(brand/outlet)
const resendResetPasswordEmail = async (managerId) => {
  const user = await User.findById({ _id: managerId });
  if (!user) throw new NotFound('User not found');

  if (user.role === BRAND_MANAGER) {
    await sendSetPasswordEmail(user.email, user);
  } else if (user.role === OUTLET_MANAGER) {
    await setPasswordEmailOutlet(user.email, user);
  }

  return user;
};

// Get all Brand Manager

const getAllBrandManager = async (query) => {
  let { page = 0, limit = 10, owner } = query;

  let users;

  if (owner) {
    users = await User.find({ role: BRAND_MANAGER, ownerId: owner });
  } else {
    users = await User.find({ role: BRAND_MANAGER })
      .sort({ votes: 1, _id: 1 })
      .skip(page)
      .limit(limit);
  }

  return users;
};

// Edit Brand Manager

const updateBrandManager = async (id, value, file) => {
  const { brands } = value;

  if (file) {
    value.profilePic = file.filename;
  }

  if (!brands && brands.length < 1)
    throw new BadRequest('Atleast assign a brand');

  const assignedBrands = await Brand.find({ _id: brands });
  const assignedOutlets = await Outlet.find({ brandId: brands });

  value.brands = assignedBrands;
  value.outlets = assignedOutlets;

  const brandManager = await User.findByIdAndUpdate({ _id: id }, value, {
    new: true,
  });

  if (!brandManager) {
    throw new BadRequest('Invalid Brand Manager id Request');
  }
  return brandManager;
};

// Delete Brand Manager
const deleteBrandManager = async (id) => {
  const brandManager = await User.findByIdAndDelete({ _id: id });

  if (!brandManager) {
    throw new BadRequest('Could not Delete the Brand Manager');
  }

  return brandManager;
};

module.exports = {
  addUser,
  updateUser,
  deleteUserById,
  getUsers,
  getUserById,
  updateEmail,
  verifyChangedEmail,
  createBrandManager,
  updatePassword,
  setManagerPassword,
  resendResetPasswordEmail,
  updateBrandManager,
  getAllBrandManager,
  deleteBrandManager,
};
