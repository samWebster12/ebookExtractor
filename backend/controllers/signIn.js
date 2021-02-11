require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/user');

async function signInController(req, res) {
  //SET CREDS

  const username = req.body.username;
  const password = req.body.password;
  const user = { username, password };

  //FETCH USER FROM DATABASE
  let users;
  try {
    users = await User.findAll({
      where: {
        username: username,
        password: password,
      },
    });
  } catch {
    res.status(400).json({ error: 'Failed to query database' });
  }

  //TEST WHETHER USER EXISTS
  if (!users[0]) {
    res.status(403).json({ error: 'Credentials not found' });
  }

  //CREATE AND SEND BACK JWT TOKEN
  jwt.sign({ user }, process.env.JWT_SECRET, (err, token) => {
    if (err) {
      res.status(400).json({ error: 'Failed to create JWT token' });
    }
    res.status(200).json({
      token,
    });
  });
}

module.exports = signInController;
