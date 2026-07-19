const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded);
    req.user = { id: decoded.userId }; // Attach user ID from token to req
    next();
  } catch (error) {
    console.error("JWT verification error:", error);
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authenticate;
