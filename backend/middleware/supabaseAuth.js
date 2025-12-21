/**
 * Supabase Auth JWT Verification Middleware
 * 
 * Verifies Supabase Auth JWT tokens using JWKS (JSON Web Key Set).
 * This middleware validates tokens issued by Supabase Auth service.
 * 
 * Token format: Authorization: Bearer <supabase-auth-token>
 */

const { jwtVerify, createRemoteJWKSet } = require("jose");

/**
 * Supabase Auth middleware
 * Verifies JWT token from Authorization header and attaches user to request
 */
async function supabaseAuth(req, res, next) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Format: "Bearer <token>"

    if (!token) {
      return res.status(401).json({
        error: {
          message: "Unauthorized",
        },
      });
    }

    // Get Supabase URL for issuer validation
    const supabaseUrl = process.env.SUPABASE_URL;
    if (!supabaseUrl) {
      console.error("ERROR: SUPABASE_URL must be set in .env");
      return res.status(500).json({
        error: {
          message: "Server misconfigured",
        },
      });
    }

    // Build JWKS URL
    const jwksUrl = `${supabaseUrl}/auth/v1/.well-known/jwks.json`;

    // Create JWKS client for Supabase
    const JWKS = createRemoteJWKSet(new URL(jwksUrl));

    // Verify token
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: `${supabaseUrl}/auth/v1`, // Supabase Auth issuer
      audience: "authenticated", // Supabase Auth tokens have this audience
    });

    // Attach user info to request
    // Supabase Auth token contains: sub (user ID), email, role, etc.
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role || "authenticated",
      ...payload,
    };

    next();
  } catch (err) {
    // Handle specific error types
    if (err.code === "ERR_JWT_EXPIRED") {
      return res.status(401).json({
        error: {
          message: "Unauthorized",
        },
      });
    }

    if (err.code === "ERR_JWT_INVALID" || err.code === "ERR_JWS_INVALID") {
      return res.status(401).json({
        error: {
          message: "Unauthorized",
        },
      });
    }

    // Generic error
    console.error("Supabase Auth JWT verification error:", err.message);
    return res.status(401).json({
      error: {
        message: "Unauthorized",
      },
    });
  }
}

module.exports = { supabaseAuth };

