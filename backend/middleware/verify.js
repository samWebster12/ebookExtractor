require('dotenv').config();
const jwt = require('jsonwebtoken');
const verifyToken = require('../utils/verifyToken');

function signinVerify(req, res, next) {
  if (req.body.code != process.env.AUTH_CODE) {
    res.status(403).json({ error: 'failed to pass authentication' });
  }
  next();
}

function verify(req, res, next) {
  //VERIFY AUTH_CODE SENT IN BODY
  if (req.body.code != process.env.AUTH_CODE) {
    res.status(403).json({ error: 'failed to pass authentication' });
    return;
  }

  //Verify JWT token
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader === 'undefined') {
    res.status(403).json({ error: 'failed to pass authentication' });
  }

  const bearer = bearerHeader.split(' ');
  const bearerToken = bearer[1];

  jwt.verify(bearerToken, process.env.JWT_SECRET, (err) => {
    if (err) {
      res.status(403).json({ error: 'failed to pass authentication' });
      return;
    }

    next();
  });
}

module.exports.verify = verify;
module.exports.signinVerify = signinVerify;
