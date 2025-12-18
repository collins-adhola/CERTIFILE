/**
 * Authentication Routes
 * 
 * Handles admin login and user info endpoints.
 */

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// Rate limiting for login endpoint
const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per window
  message: "Too many login attempts, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * POST /api/v1/auth/login
 * Admin login endpoint (rate limited)
 */
router.post("/login", loginRateLimit, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Get admin credentials from environment
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
    const jwtSecret = process.env.JWT_SECRET;
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "12h";

    // Check if admin is configured
    if (!adminEmail || !adminPasswordHash || !jwtSecret) {
      console.error("ERROR: ADMIN_EMAIL, ADMIN_PASSWORD_HASH, and JWT_SECRET must be set in .env");
      return res.status(500).json({
        message: "Server misconfigured",
      });
    }

    // Validate email matches admin email
    if (email.toLowerCase().trim() !== adminEmail.toLowerCase().trim()) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // Compare password with hash
    const passwordMatch = await bcrypt.compare(password, adminPasswordHash);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        email: adminEmail,
        role: "admin",
      },
      jwtSecret,
      {
        expiresIn: jwtExpiresIn,
      }
    );

    return res.json({
      token,
      expiresIn: jwtExpiresIn,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
});

/**
 * GET /api/v1/auth/me
 * Get current authenticated user info (protected)
 */
router.get("/me", authenticateToken, (req, res) => {
  return res.json({
    email: req.user.email,
    role: req.user.role,
  });
});

module.exports = router;

