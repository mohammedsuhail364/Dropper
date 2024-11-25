const catchAsyncError = require("../middlewares/catchAsyncError");
const User = require("../models/userModel");
const errorhandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwt");
const sendEmail = require("../utils/email");
const crypto = require("crypto");
// Register User-/api/v1/register
exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;
  let avatar;
  let BASE_URL=process.env.BACKEND_URL;
  if(process.env.NODE_ENV==='production'){
    BASE_URL=`${req.protocol}://${req.get('host')}`
  }
  if (req.file){
    avatar=`${BASE_URL}/uploads/user/${req.file.originalname}`
  }
  const user = await User.create({
    name,
    email,
    password,
    avatar,
  });
  sendToken(user, 201, res);
});
// Login User - /api/v1/login
exports.loginuser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new errorhandler("Please enter email & password", 400));
  }
  // finding the user from database
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new errorhandler("Invalid email or Password", 401));
  }
  if (!(await user.isValidPassword(password))) {
    return next(new errorhandler("Invalid email or Password", 401));
  }
  sendToken(user, 201, res);
});
// Logout - /api/v1/logout
exports.logoutUser = (req, res, next) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .status(200)
    .json({
      success: true,
      message: "Logged Out",
    });
};
// Forgot Password - /api/v1/password/forgot
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new errorhandler("User not found with this email", 404));
  }

  const resetToken = user.getResetToken();

  await user.save({ validateBeforeSave: false });
  let BASE_URL=process.env.FRONTEND_URL;
  if(process.env.NODE_ENV==='production'){
    BASE_URL=`${req.protocol}://${req.get('host')}`
  }
  // create reset url

  const resetUrl = `${BASE_URL}/password/reset/${resetToken}`;

  const message = `Your password reset url is as follows \n\n
    ${resetUrl}\n\n If You have not requested this email,then ignore it.`;

  try {
    sendEmail({
      email: user.email,
      subject: "suhail cart password recovery",
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email}`,
    });
  } catch {
    user.resetpasswordtoken = undefined;
    user.resetpasswordtokenExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new errorhandler(error.message, 500));
  }
});
//Reset Password-/api/v1/password/reset/:token
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  const resetPasswordtoken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  console.log(resetPasswordtoken);
  const user = await User.findOne({
    resetpasswordtoken: resetPasswordtoken,
    resetpasswordtokenExpire: {
      $gt: Date.now(),
    },
  });
  console.log(user);
  if (!user) {
    return next(
      new errorhandler("Password reset token is invalid or expired", 404)
    );
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(new errorhandler("Password does not match", 404));
  }
  user.password = req.body.password;
  user.resetpasswordtoken = undefined;
  user.resetpasswordtokenExpire = undefined;
  await user.save({ validateBeforeSave: false });

  sendToken(user, 201, res);
});

// get user profile -/api/v1/myprofile
exports.getUserProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});

// Change Password - /api/v1/login
exports.changePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  //  check old password
  if (!(await user.isValidPassword(req.body.oldPassword))) {
    return next(new errorhandler("Old Password is Incorrect", 401));
  }
  //  assigning new password
  user.password = req.body.password;
  await user.save();
  res.status(200).json({
    success: true,
  });
});

// updateProfile - /api/v1/update
exports.updateProfile = catchAsyncError(async (req, res, next) => {
  let newUserData = {
    name: req.body.name,
    email: req.body.email,
  };
  let avatar;
  let BASE_URL=process.env.BACKEND_URL;
  if(process.env.NODE_ENV==='production'){
    BASE_URL=`${req.protocol}://${req.get('host')}`
  }
  if (req.file){
    avatar=`${BASE_URL}/uploads/user/${req.file.originalname}`
    newUserData={...newUserData,avatar}
  }
  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    user,
  });
});

// Admin:Get all users -/api/v1/admin/users
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});
// Admin: Get specific user-/api/v1/admin/user/:id
exports.getUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new errorhandler(`User Not Found with this id ${req.params.id}`)
    );
  }
  res.status(200).json({
    success: true,
    user,
  });
});

// Admin: Update User -/api/v1/admin/user/:id
exports.updateUser = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };
  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    user,
  });
});

// Admin:Delete user -/api/v1/admin/user/:id
exports.deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`User Not Found with this id ${req.params.id}`)
    );
  }

  await User.deleteOne({ _id: req.params.id });

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});
