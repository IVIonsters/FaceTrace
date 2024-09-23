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
const database ={
  users: [
    {
      id: '123',
      name: 'IVIonsters',
      email: 'IVIonsters@gmail.com',
      password: 'cookies',
      entries: 0,
      joined: new Date()
    },
    {
      id: '124',
      name: 'Zachary',
      email: 'Zachary@gmail.com',
      password: 'bananas',
      entries: 0,
      joined: new Date()
    }
  ]
}

// Routes
app.get('/', (req, res) => {
    res.json(database.users);
})

// Signin
app.post('/signin', (req, res) => {
    if (req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password) {
            res.json('Ello Mate, User Signed In! 👋');
        } else {
            res.status(400).json('Sad News Mate 😢, User not found!');
        }
})

// Register
app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
    database.users.push({
      id: '125',
      name: name,
      email: email,
      password: password,
      entries: 0,
      joined: new Date()
    })
    res.json(database.users[database.users.length-1]);
});

// Profile
app.get('/profile/:id', (req, res)=> {
    const { id } = req.params;
    let found = false;
    database.users.forEach(user => {
      if (user.id === id) {
        found = true;
        return res.json(user);
      } 
    })
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
      user.entries++
      return res.json(user.entries);
    } 
  })
  if (!found) {
    res.status(400).json('Sorry Mate, No user found!');
  }
});

// // bcrypt-nodejs
// bcrypt.hash("bacon", null, null, function(err, hash) {
//   // Store hash in your password DB.
// });

// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//   // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//   // res = false
// });

// Port
app.listen(3001, () => {
    console.log('Server, Shes up and running on port 3001 mate! 🚀');
})

// plan for api
/* 
routes --> res = this is working
signin --> POST = success/fail
register --> POST = user
profile/:userId --> GET = user
image --> PUT --> user
*/