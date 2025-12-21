/**
 * Admin Authorization Middleware
 * 
 * Checks if the authenticated user's email is in the admin allowlist.
 * Must be used after supabaseAuth middleware.
 */

function requireAdmin(req, res, next) {
  // Check if user is attached (should be set by supabaseAuth middleware)
  if (!req.user || !req.user.email) {
    return res.status(401).json({
      error: {
        message: "Unauthorized",
      },
    });
  }

  // Get admin email allowlist from environment
  const adminEmailAllowlist = process.env.ADMIN_EMAIL_ALLOWLIST;
  
  if (!adminEmailAllowlist) {
    console.error("ERROR: ADMIN_EMAIL_ALLOWLIST must be set in .env");
    return res.status(500).json({
      error: {
        message: "Server misconfigured",
      },
    });
  }

  // Parse comma-separated allowlist
  const allowedEmails = adminEmailAllowlist
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter((email) => email.length > 0);

  // Check if user's email is in allowlist
  const userEmail = req.user.email.toLowerCase().trim();

  if (!allowedEmails.includes(userEmail)) {
    return res.status(403).json({
      error: {
        message: "Forbidden",
      },
    });
  }

  // User is authorized, continue
  next();
}

module.exports = { requireAdmin };

