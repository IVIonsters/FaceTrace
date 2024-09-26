const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const dotenv = require('dotenv');
const knex = require('knex');

dotenv.config();

// Initialize knex with PostgreSQL connection
const db = knex({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
});

// Test database connection by logging users
db.select('*').from('users')
  .then(data => {
    console.log('Users:', data);
  })
  .catch(err => {
    console.error('Error fetching users:', err);
  });


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

// Clarifai API details
const USER_ID = 'clarifai';
const APP_ID = 'main';
const MODEL_ID = 'face-detection';
const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';
const CLARIFAI_API_KEY = process.env.REACT_APP_CLARIFAI_PAT; // Ensure this environment variable is set

// Proxy endpoint for Clarifai API
app.post('/clarifai', async (req, res) => {
  const fetch = (await import('node-fetch')).default; // Dynamic import for node-fetch
  const CLARIFAI_API_URL = `https://api.clarifai.com/v2/models/${MODEL_ID}/versions/${MODEL_VERSION_ID}/outputs`;

  const raw = JSON.stringify({
    "user_app_id": {
      "user_id": USER_ID,
      "app_id": APP_ID
    },
    "inputs": [
      {
        "data": {
          "image": {
            "url": req.body.input
          }
        }
      }
    ]
  });

  const requestOptions = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Key ${CLARIFAI_API_KEY}`
    },
    body: raw
  };

  try {
    const response = await fetch(CLARIFAI_API_URL, requestOptions);
    const result = await response.json();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch from Clarifai API' });
  }
});

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
  db('users').insert({
    email: email,
    name: name,
    joined: new Date()
  }).then(console.log);
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

// Port
app.listen(3001, () => {
  console.log('Server, Shes up and running on port 3001 mate! 🚀');
});