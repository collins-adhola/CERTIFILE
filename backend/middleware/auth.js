/**
 * JWT Authentication Middleware
 * 
 * Verifies JWT tokens from Authorization header and attaches user to request.
 * Used to protect admin endpoints.
 */

const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  // Get token from Authorization header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Format: "Bearer <token>"

  if (!token) {
    return res.status(401).json({
      message: "Authentication required",
      error: "No token provided",
    });
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    console.error("ERROR: JWT_SECRET must be set in .env");
    return res.status(500).json({
      message: "Server misconfigured",
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, jwtSecret);
    
    // Attach user info to request
    req.user = decoded;
    
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Authentication required",
        error: "Token expired",
      });
    }
    
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Authentication required",
        error: "Invalid token",
      });
    }

    console.error("JWT verification error:", err);
    return res.status(401).json({
      message: "Authentication required",
      error: "Token verification failed",
    });
  }
}

module.exports = { authenticateToken };

