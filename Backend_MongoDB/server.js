const express = require('express');
const mongoose = require('mongoose')
const cors = require('cors');

const app = express();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ✅ IMPORTANT for form data
app.use(cors());

mongoose.connect('mongodb://localhost:27017/Backend_task')
    .then(() =>  console.log('MongoDB Conected'))
    .catch(err => console.log(err))

const User = require("./models/User");

app.get('/', async (req, res) => {
  const users = await User.find();
  res.render('home', { users });
});

app.post('/submit', async (req, res) => {
    try{
        const {name,email } = req.body;

         if (!name || !email) {
      return res.status(400).json({ message: "All fields required" });
    }

     const newUser = new User({ name, email });
    await newUser.save();

    res.status(201).json({ message: "Data saved successfully", data: newUser });
  } catch (error) {

    // mongoose validation error
    if (error.name === "ValidationError") {
      return res.status(400).json({
        errors: Object.values(error.errors).map(e => e.message)
      });
    }

    // duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    res.status(500).json({ message: "Server Error", error });
  }

});

app.listen(8000, () =>{
    console.log('server is running on 8000')
})