const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

const auth = async (req, res, next) => {
  const token = req.header("token");
  if (!token) {
    res.status(400).json({
      success: false,
      message: "Not authorized",
    });
  }
  const verified = jwt.verify(token, "secret");
  await User.findOne({ _id: verified._id }).then((userData) => {
    req.user = userData;
    next();
  });
};

module.exports = auth;
