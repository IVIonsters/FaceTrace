// setup express server
const express = require('express');
const app = express();

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
    res.send('Ello Mate, Shes working! 👋');
})

// Signin
app.post('/signin', (req, res) => {
    res.json('Ello Mate, Signin working! 👋');
})

// Register

// Profile

// Image

// Port
app.listen(3000, () => {
    console.log('Server, Shes up and running on port 3000 mate! 🚀');
})


/* 
routes --> res = this is working
signin --> POST = success/fail
register --> POST = user
profile/:userId --> GET = user
image --> PUT --> user
*/