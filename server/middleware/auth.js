const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('x-auth-token');
    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, 'your_jwt_secret_key_here');
    req.user = decoded.userId; // Attach user ID to request
    next();
  } catch (err) {
    console.log('Auth middleware error:', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
// const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
// const decoded = jwt.verify(token, process.env.JWT_SECRET);

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