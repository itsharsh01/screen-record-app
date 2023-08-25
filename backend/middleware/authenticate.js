const jwt = require('jsonwebtoken');
const User = require("../models/userSchema");
// ...

const authenticate = async (req, res, next) => {
  try {
    console.log("Enter authenticate");
    console.log(req.cookies);
    const token = req.cookies.jwtoken;
    if (!token) {
      throw new Error('Token not provided');
    }
    console.log("Token Fetched From Cookies");

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const rootUser = await User.findOne({ _id: decoded._id, "token": token });
    
    console.log("Token Verified");

    if (!rootUser) {
      throw new Error('User not Found');
    }

    //req.token = token;
    req.rootUser = rootUser;
    req.userID = rootUser._id;
    console.log("Token success");
    next();

  } catch (error) {
    res.status(401).send('Unauthorized: ' + error.message);
    console.log(error);
  }
}

module.exports = authenticate;
