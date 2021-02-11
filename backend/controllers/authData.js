const jwt = require('jsonwebtoken');
require('dotenv').config();

function authData(req, res) {
  const bearerHeader = req.headers['authorization'];
  const bearer = bearerHeader.split(' ');
  const bearerToken = bearer[1];

  jwt.verify(bearerToken, process.env.JWT_SECRET, (err, authData) => {
    if (err) {
      res.status(500).json({ error: 'something went wrong' });
    } else {
      res.status(200).json({
        error: '',
        authData,
      });
    }
  });
}

module.exports = authData;
