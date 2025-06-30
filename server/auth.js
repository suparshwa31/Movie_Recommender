// authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = (req) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      return { user };
    } catch (err) {
      return { user: null };
    }
  }
  
  return { user: null };
};