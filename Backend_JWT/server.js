require('dotenv').config();

const express = require("express");
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const authMiddleware = require('./middleware/auth');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());
app.use(cors());

const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('DB Connected'))
  .catch(err => console.log(err));

const SECRET = process.env.JWT_SECRET ;



//  Register
app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    res.json({ message: "User Registered" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//  Login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.json({ message: "User not found" });

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ message: "Wrong password" });

    // create token
    const token = jwt.sign(
      { userId: user._id },
      SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login Success", token });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//  Protected Route
app.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    res.json({
      message: "Access granted",
      user
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/dashboard', authMiddleware, (req, res) => {
  res.json({
    message: "Welcome to dashboard",
    user: req.user
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});