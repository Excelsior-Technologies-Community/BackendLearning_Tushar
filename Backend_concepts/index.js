const express = require('express');
const app = express();

app.use(express.json());

let users = [
  { id: 1, name: "Tushar", age: 25,  email: "tushar@gmail.com", },
  { id: 2, name: "Rahul", age: 30, email: "rahul@gmail.com", }
];

app.get('/', (req, res) => {
    res.send('Hello Guys!');
})

app.get('/users',((req, res) => {
    res.json(users);
}))

app.post('/users', (req, res) => {
    const newUser = { id: users.length + 1, ...req.body };
    users.push(newUser);
    res.status(201).json(newUser);

});

app.put('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const updateData = req.body;
    
   const userExists = users.some(user => user.id === id);
  if (!userExists) {
    return res.status(404).json({ error: "user not found" });
  }

  users = users.map(user =>
    user.id === id ? { ...user, ...updateData } : user
  );

  res.json({ message: "user updated" });

})

app.delete('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);

  const userExists = users.some(user => user.id === id);
  if (!userExists) {
    return res.status(404).json({ error: "user not found" });
  }

  users = users.filter(user => user.id !== id);
  res.json({ message: "user deleted" });
});

app.listen(5001, () => {
    console.log('server is running on port 5001');
})