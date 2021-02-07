const express = require('express');
const path = require('path');
const getEbooksController = require('./controllers/getEbooks');
const signInController = require('./controllers/signIn');
const verifyTokenController = require('./controllers/verifyToken');
const User = require('./models/user');

//SETUP
const PORT = 8080;
const server = express();
server.use(express.static(path.join(__dirname, 'views')));
server.use(express.json());

//TEST CREATE USER
/*
(async () => {
  try {
    await User.create({
      username: 'sammy',
      password: 'password',
      firstname: 'sam',
      lastname: 'webster',
      email: 'sammy@gmail.com',
    });
  } catch (e) {
    console.log(e);
  }
})();*/

//CORS
server.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); //'http://localhost:3000'
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

//ROUTES
server.get('/api/verify', verifyTokenController);
server.post('/api/signin', signInController);
server.post('/api/ebooks', getEbooksController);

//LISTEN
server.listen(PORT, () => {
  console.log('Listening on port ' + PORT);
});
