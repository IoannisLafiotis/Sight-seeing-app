const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");

const User = require("../models/user");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed , please try again later",
      500
    );
    return next(error);
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invlid ipnputs passed, please check your data", 422)
    );
  }

  const { name, email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Sigining up failed,please try again later",
      500
    );
    return next(error);
  }
  if (existingUser) {
    const error = new HttpError("User exists,please try login!", 422);
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image:
      "https://images.unsplash.com/photo-1555952517-2e8e729e0b44?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    password,
    places: [],
  });
  console.log(createdUser);
  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Singing up failed", 500);
    return next(error);
  }
  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Loging in failed,please try again later", 500);
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    return next(
      new HttpError("Invalid credential, could not identify the user", 401)
    );
  }
  console.log(res.json());
  res.json({ message: "logged in" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
