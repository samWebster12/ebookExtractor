const jwt = require('jsonwebtoken');
require('dotenv').config();

function verifyToken(req, res) {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader === 'undefined') {
    res.staus(403).json({ passed: 'false' });
  }

  const bearer = bearerHeader.split(' ');
  const bearerToken = bearer[1];

  jwt.verify(bearerToken, process.env.JWT_SECRET, (err, authData) => {
    if (err) {
      res.staus(403).json({ passed: 'false' });
    } else {
      res.status(200).json({
        passed: 'true',
        authData,
      });
    }
  });
}

module.exports = verifyToken;
