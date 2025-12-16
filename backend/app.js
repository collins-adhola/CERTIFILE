const express = require("express");
const cors = require("cors");

function createApp() {
  const app = express();

  // Enhanced CORS configuration
  app.use(
    cors({
      origin: true, // Allow all origins (for development)
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  );
  app.use(express.json());

  // TEMP: in-memory storage for submissions (for MVP testing)
  const submissions = [];

  // Health check route
  app.get("/health", (req, res) => {
    res.json({ status: "okey Collins - it works" });
  });

  // ✅ Public endpoint – create a submission (used by your Certifile form)
  app.post("/api/v1/submissions", (req, res) => {
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

    const submission = {
      id: String(Date.now()), // simple ID for now
      fullName,
      email,
      phone: phone || null,
      documentType,
      documentNumber: documentNumber || null,
      issuedBy: issuedBy || null,
      issuedOn: issuedOn || null,
      expiresOn: expiresOn || null,
      fileUrl: fileUrl || null,
      status: "received", // MVP workflow: received → in_review → approved/rejected
      createdAt: new Date().toISOString(),
    };

    submissions.push(submission);

    // In real app, we’d write to DB and log audit here
    console.log("New submission received:", submission);

    return res.status(201).json({
      message: "Submission received",
      submissionId: submission.id,
    });
  });

  // ✅ TEMP: simple admin-style list (no auth yet – just for you to see data)
  app.get("/api/v1/submissions", (req, res) => {
    res.json({ submissions });
  });

  return app;
}

module.exports = { createApp };
