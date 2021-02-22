const bcrypt = require("bcrypt");
const { User } = require("../db/models");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRATION_MS } = require("./config/keys");

exports.signup = async (req, res, next) => {
  const saltRounds = 10;
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    console.log("exports.signup -> hashedPassword", hashedPassword);

    req.body.password = hashedPassword;
    const newUser = await User.create(req.body);

    const { user } = req;
    const payload = {
      id: user.id,
      username: user.username,
      exp: Date.now() + JWT_EXPIRATION_MS,
      // 900000 is 15 minutes
    };
    const token = jwt.sign(JSON.stringify(payload), JWT_SECRET);
    res.status(201).json({ token });

    res.status(201).end();
  } catch (error) {
    next(error);
  }
};

exports.signin = (req, res) => {
  console.log("exports.signin -> req", req);

  const { user } = req;
  const payload = {
    id: user.id,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,

    exp: Date.now() + JWT_EXPIRATION_MS,
    // 900000 is 15 minutes
  };
  const token = jwt.sign(JSON.stringify(payload), JWT_SECRET);
  res.status(201).json({ token });
};
