/**
 * Core Intake API v1.0 - Server Entry Point
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
 * How to Reuse:
 *   1. Copy this backend folder to your new project
 *   2. Create a Supabase table matching the schema (see README.md)
 *   3. Fill in .env with your Supabase credentials
 *   4. Deploy to your hosting provider (Render, Railway, etc.)
 *   5. Connect your frontend to the API endpoints
 *
 * This backend intentionally keeps submissions generic by design:
 *   - document_type and issued_by fields allow reuse across domains
 *   - Frontends should not know about database structure
 *   - Auth is intentionally not baked in yet for flexibility
 */

require("dotenv").config();
const { createApp } = require("./app");

const PORT = process.env.PORT || 5050;

const app = createApp();

app.listen(PORT, () => {
  console.log(`Core Intake API v2.0 running on port ${PORT}`);
});
