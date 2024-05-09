const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const JWT_SECRET = "alokmishra";
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      console.info("User not found");
      return res
        .status(401)
        .json({ message: "Authentication failed, User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.info("Wrong password");
      return res
        .status(401)
        .json({ message: "Authentication failed, Wrong password" });
    }

    const payload = {
      id: user.id,
      username: user.username,
    };

    jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" }, (err, token) => {
      if (err) throw err;
      res.status(200).json({ success: true, message: `Bearer ${token}` });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json("Something went wrong");
  }
};

exports.signup = async (req, res) => {
  try {
    const { username, password } = req.body;

    let user = await User.findOne({ username });

    if (user) {
      console.info("User already exists");
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      username,
      password: hashedPassword,
    });

    await user.save();

    res.status(200).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json("Something went wrong");
  }
};
