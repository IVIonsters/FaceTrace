// setup express server and body-parser / bcrypt-nodejs
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const app = express();

// body-parser middleware
app.use(bodyParser.json());
app.use(cors());

// database variable users
const database = {
  users: [
    {
      id: '123',
      name: 'IVIonsters',
      email: 'IVIonsters@gmail.com',
      password: bcrypt.hashSync('cookies'),
      entries: 0,
      joined: new Date()
    },
    {
      id: '124',
      name: 'Zachary',
      email: 'Zachary@gmail.com',
      password: bcrypt.hashSync('bananas'),
      entries: 0,
      joined: new Date()
    }
  ]
};

// Routes
app.get('/', (req, res) => {
  res.json(database.users);
});

// Signin
app.post('/signin', (req, res) => {
  const { email, password } = req.body;
  let found = false;
  database.users.forEach(user => {
    if (user.email === email) {
      found = true;
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          res.json('Ello Mate, User Signed In! 👋');
        } else {
          res.status(400).json('Sad News Mate 😢, User not found!');
        }
      });
    }
  });
  if (!found) {
    res.status(400).json('Sad News Mate 😢, User not found!');
  }
});

// Register
app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  const hash = bcrypt.hashSync(password);
  database.users.push({
    id: '125',
    name: name,
    email: email,
    password: hash,
    entries: 0,
    joined: new Date()
  });
  res.json(database.users[database.users.length - 1]);
});

// Profile
app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    }
  });
  if (!found) {
    res.status(400).json('Sorry Mate, No user found!');
  }
});

// Image
app.put('/image', (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });
  if (!found) {
    res.status(400).json('Sorry Mate, No user found!');
  }
});

// Port
app.listen(3001, () => {
  console.log('Server, Shes up and running on port 3001 mate! 🚀');
});