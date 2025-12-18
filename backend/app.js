/**
 * Core Intake API v2.0 - Express Application
 *
 * This is a reusable backend API designed to be copied into new projects.
 *
 * Purpose:
 *   - Public submission endpoint: Accepts form submissions from any frontend
 *   - Admin review endpoint: Allows admins to view all submissions
 *
 * Authentication Strategy:
 *   - v1.0: Used simple x-admin-key header for admin endpoints (deprecated)
 *   - v2.0: JWT-based authentication with bcrypt password hashing
 *
 * Endpoints:
 *   - POST /api/v1/submissions - Public endpoint for creating submissions
 *   - GET /api/v1/submissions - Admin endpoint (requires JWT token)
 *   - POST /api/v1/auth/login - Admin login endpoint
 *   - GET /api/v1/auth/me - Get current user info (requires JWT token)
 *   - GET /api/v1/meta - Metadata endpoint (API version, features)
 *   - GET /health - Health check endpoint
 *
 * Database:
 *   - Uses Supabase PostgreSQL
 *   - Table: submissions (see README.md for schema)
 *   - Maps frontend camelCase to database snake_case
 *
 * Reusability Notes:
 *   - Submissions are generic by design (document_type, issued_by allow domain flexibility)
 *   - Frontends should not know about database structure
 *   - JWT authentication is built-in for admin endpoints
 */

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { createClient } = require("@supabase/supabase-js");
const authRoutes = require("./routes/auth");
const { authenticateToken } = require("./middleware/auth");

function createApp() {
  const app = express();

  // Security: Helmet for basic security headers
  app.use(helmet());

  // Initialize Supabase client
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error(
      "ERROR: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env",
    );
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Enhanced CORS configuration
  const corsOrigin = process.env.CORS_ORIGIN;
  const allowedOrigins = corsOrigin
    ? corsOrigin.split(",").map((origin) => origin.trim())
    : true; // Allow all origins if CORS_ORIGIN not set (for development)

  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "x-admin-key"], // Keep x-admin-key for backward compatibility during migration
    }),
  );
  app.use(express.json());

  // Health check route
  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Metadata endpoint - Returns API version and feature flags
  app.get("/api/v1/meta", (req, res) => {
    res.json({
      name: "Core Intake API",
      version: "2.0.0",
      features: {
        publicSubmission: true,
        adminRead: true,
        authentication: true,
      },
    });
  });

  // Authentication routes
  // Note: Rate limiting is applied in the route handler itself
  app.use("/api/v1/auth", authRoutes);

  // ✅ Public endpoint – create a submission (used by your Certifile form)
  app.post("/api/v1/submissions", async (req, res) => {
    try {
      const {
        fullName,
        email,
        phone,
        documentType,
        documentNumber,
        issuedBy,
        issuedOn,
        expiresOn,
        fileUrl,
      } = req.body;

      // Very basic validation (MVP)
      if (!fullName || !email || !documentType) {
        return res.status(400).json({
          error: {
            message: "fullName, email and documentType are required",
          },
        });
      }

      // Insert submission into Supabase
      // Map frontend camelCase to database snake_case columns
      const insertData = {
        full_name: fullName,
        email: email,
        phone: phone || null,
        document_type: documentType,
        document_number: documentNumber || null,
        issued_by: issuedBy || null,
        issued_on: issuedOn || null,
        expires_on: expiresOn || null,
        file_url: fileUrl || null,
        status: "received", // MVP workflow: received → in_review → approved/rejected
      };

      console.log("Attempting to insert:", insertData);

      const { data, error } = await supabase
        .from("submissions")
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error("Database error:", error);
        console.error("Error code:", error.code);
        console.error("Error details:", error.details);
        console.error("Error hint:", error.hint);
        return res.status(500).json({
          error: {
            message: "Failed to save submission to database",
            details: error.message,
            code: error.code,
            hint: error.hint,
          },
        });
      }

      console.log("New submission received:", data);

      return res.status(201).json({
        message: "Submission received",
        submissionId: data.id,
      });
    } catch (err) {
      console.error("Unexpected error in POST /api/v1/submissions:", err);
      console.error("Error stack:", err.stack);
      return res.status(500).json({
        error: {
          message: "Internal server error",
          details: err.message,
          stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
        },
      });
    }
  });

  // ✅ Admin endpoint – list all submissions (requires JWT token)
  app.get("/api/v1/submissions", authenticateToken, async (req, res) => {
    try {
      const { data, error } = await supabase
        .from("submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Database error:", error);
        return res.status(500).json({
          error: {
            message: "Failed to fetch submissions from database",
            details: error.message,
          },
        });
      }

      return res.json({ submissions: data || [] });
    } catch (err) {
      console.error("Unexpected error:", err);
      return res.status(500).json({
        error: {
          message: "Internal server error",
          details: err.message,
        },
      });
    }
  });

  return app;
}

module.exports = { createApp };
