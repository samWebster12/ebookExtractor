const express = require('express');
const path = require('path');
const getEbooksController = require('./controllers/getEbooks');
const signInController = require('./controllers/signIn');
const authDataController = require('./controllers/authData');
const verifyFuncs = require('./middleware/verify');

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
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, Origin, X-Requested-With, Accept',
  );
  next();
});

//ROUTES

server.post('/api/authdata', verifyFuncs.verify, authDataController);
server.post('/api/signin', verifyFuncs.signinVerify, signInController);
server.post('/api/ebooks', verifyFuncs.verify, getEbooksController);

//LISTEN
server.listen(PORT, () => {
  console.log('Listening on port ' + PORT);
});
