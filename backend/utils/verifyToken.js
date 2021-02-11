const jwt = require('jsonwebtoken');
require('dotenv').config();

function verifyToken(bearerHeader) {
  if (typeof bearerHeader === 'undefined') {
    return { passed: false };
  }

  const bearer = bearerHeader.split(' ');
  const bearerToken = bearer[1];

  jwt.verify(bearerToken, process.env.JWT_SECRET, (err, authData) => {
    if (err) {
      return { passed: false };
    } else {
      return {
        passed: true,
        authData,
      };
    }
  });
}

module.exports = verifyToken;
