const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    console.log('No token provided'); // Debug log
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret_key_here');
    console.log('Token decoded:', decoded); // Debug log
    req.user = decoded.userId;
    next();
  } catch (err) {
    console.log('Token verification error:', err.message); // Debug log
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = auth;