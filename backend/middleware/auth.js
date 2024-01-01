const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");


exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    const {token}  = req.cookies;

    if(!token){
        return next(new ErrorHander("Please login to access this Resource",401));
    }

    
  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  

  req.user = await User.findById(decodedData.id);

  next();


});


exports.authorizeRoles= (...roles) =>{

  return (req, res, next) => {
    // if user tries to access .Dont allow 
    // Here it checks whether roles array has the role of the user in its array.
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHander(
          `Role: ${req.user.role} is not allowed to access this resouce `,
          403
        )
      );
    }
    // if admin allow
    next();

  };


}