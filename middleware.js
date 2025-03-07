
require('dotenv').config();
const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        console.log("JWT verification failed:", err); //log the error
        return res.status(403).json({ error: 'Forbidden' });
      }

      console.log("JWT Payload:", user); // Log the JWT payload
      req.user = user;
      next();
    });
  } else {
    console.log("No auth header"); //log the missing header
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

module.exports = { authenticateJWT };