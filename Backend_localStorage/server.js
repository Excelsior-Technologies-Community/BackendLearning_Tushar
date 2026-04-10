const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const filePath = path.join(__dirname, "data.json");

// Get all users
app.get("/users", (req, res) => {
  const data = JSON.parse(fs.readFileSync(filePath));
  res.json(data);
});

// Add user
app.post("/users", (req, res) => {
  const users = JSON.parse(fs.readFileSync(filePath));

// generate next ID
const lastUser = users[users.length - 1];
const newId = lastUser ? lastUser.id + 1 : 1;

const newUser = {
  id: newId,
  name: req.body.name,
  email: req.body.email,
};

  users.push(newUser);
  
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

  res.json({ message: "User added", user: newUser });
});

// Delete user
app.delete("/users/:id", (req, res) => {
  let users = JSON.parse(fs.readFileSync(filePath));

  users = users.filter(user => user.id != req.params.id);

  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

  res.json({ message: "User deleted" });
});

app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});