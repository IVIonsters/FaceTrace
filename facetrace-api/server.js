// setup express server
const express = require('express');
const app = express();

// Routes
app.get('/', (req, res) => {
    res.send('Ello Mate, Shes working! 👋');
})

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