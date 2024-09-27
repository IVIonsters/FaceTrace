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
  res.json('Server is running');
});

// Signin
app.post('/signin', (req, res) => {
  const { email, password } = req.body;
  console.log('Signin request:', { email, password }); // Log request data
  if (!email || !password) {
    return res.status(400).json({ error: 'Incorrect form submission' });
  }
  db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
      if (data.length) {
        const isValid = bcrypt.compareSync(password, data[0].hash);
        if (isValid) {
          return db.select('*').from('users')
            .where('email', '=', email)
            .then(user => {
              if (user.length) {
                console.log('User found:', user[0]); // Log user data
                res.json(user[0]);
              } else {
                res.status(400).json({ error: 'User not found' });
              }
            })
            .catch(err => {
              console.error('Unable to get user:', err); // Log error
              res.status(400).json({ error: 'Unable to get user' });
            });
        } else {
          res.status(400).json({ error: 'Wrong credentials' });
        }
      } else {
        res.status(400).json({ error: 'Wrong credentials' });
      }
    })
    .catch(err => {
      console.error('Wrong credentials:', err); // Log error
      res.status(400).json({ error: 'Wrong credentials' });
    });
});

// Register
app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json('Incorrect form submission');
  }
  const hash = bcrypt.hashSync(password);
  db.transaction(trx => {
    trx.insert({
      hash: hash,
      email: email
    })
    .into('login')
    .returning('email')
    .then(loginEmail => {
      return trx('users')
        .returning('*')
        .insert({
          email: loginEmail[0],
          name: name,
          joined: new Date()
        })
        .then(user => {
          res.json(user[0]);
        });
    })
    .then(trx.commit)
    .catch(trx.rollback);
  })
  .catch(err => res.status(400).json('Unable to register'));
});

// Profile
app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  db.select('*').from('users').where({ id })
    .then(user => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json('Not found');
      }
    })
    .catch(err => res.status(400).json('Error getting user'));
});

// Port
app.listen(3001, () => {
  console.log('Server, Shes up and running on port 3001 mate! 🚀');
});