const jwt = require('jsonwebtoken');

// Extract the JWT from the header of the request
const authMiddleware = (req, res, next) => {
  const token = req.header('auth-token');
//   console.log(token)
  if (!token) {
    return res.status(401).send('Access Denied!');
  }

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send('Invalid Token');
  }
};

module.exports = authMiddleware;
