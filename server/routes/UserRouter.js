const express = require("express");
const router = express.Router();
const User = require("../models/UserModel");
const { RegisterSchema, LoginSchema } = require("../validate");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");

router.post("/register", async (req, res) => {
  const { error } = RegisterSchema(req.body);
  if (error) return res.send(error.details[0].message);

  const emailExist = await User.findOne({ email: req.body.email });

  if (emailExist) return res.status(400).send("Email exists");

  const usernameExist = await User.findOne({ username: req.body.username });

  if (usernameExist) return res.status(400).send("Username exists");

  const salt = await bcrypt.genSalt(10);

  const hashPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashPassword,
    date: new Date().toISOString(),
  });
  const savedUser = await user.save();
  res.json({
    success: true,
    user: savedUser,
  });
});

router.post("/login", async (req, res) => {
  const { error } = LoginSchema(req.body);
  if (error) res.send({
    message: error.details[0].message
  });

  const user = await User.findOne({ email: req.body.email });

  if (!user) return res.status(400).send({
    success:false,
    message: "Email or Password is wrong"
  });

  const validPassword = await bcrypt.compare(req.body.password, user.password);

  if (!validPassword) return res.status(400).send({
    success:false,
    message: "Email or Password is wrong"
  });

  const token = jwt.sign({ _id: user._id }, "secret", { expiresIn: "48h" });

  res.status(200).json({
    success: true,
    token,
  });
});

router.get("/current", auth, (req, res) => {
  req.user.password = undefined;
  req.user.email = undefined;
  res.json({
    id: req.user._id,
    username: req.user.username,
  });
});

module.exports = router;
