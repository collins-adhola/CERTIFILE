# Core Intake API v1.0

A standalone, reusable backend API for handling form submissions with admin review capabilities.

## What This Backend Is

This is a simple, production-ready Node.js/Express API that provides:

- **Public submission endpoint**: Accept form submissions from any frontend
- **Admin review endpoint**: View all submissions (protected with admin key)
- **Metadata endpoint**: Check API version and feature flags

**This backend is intentionally standalone** - it has no authentication, sessions, or user concepts. It uses a simple admin key approach for v1.0.

## What Problems It Solves

- **Form submission handling**: Collect structured data from contact forms, enquiry forms, etc.
- **Admin dashboard support**: Provide data for admin interfaces to review submissions
- **Reusability**: Generic design allows reuse across different projects and domains
- **Quick deployment**: Minimal setup required, works with Supabase out of the box
- **Zero dependencies on auth systems**: You can add your own authentication layer later

## Required Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
PORT=5050                                    # Server port (default: 5050)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_key_here     # Secret! Never expose to frontend
CORS_ORIGIN=http://localhost:8100           # Allowed frontend origins (comma-separated)
ADMIN_KEY=your_strong_random_string         # Secret key for admin endpoints
```

See `.env.example` for detailed comments on each variable.

## How to Run Locally

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**

   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

3. **Start the server:**

   ```bash
   node server.js
   ```

   Or with nodemon for auto-reload:

   ```bash
   npx nodemon server.js
   ```

4. **Verify it's working:**
   ```bash
   curl http://localhost:5050/health
   curl http://localhost:5050/api/v1/meta
   ```

## How to Deploy (Render)

1. **Create a new Web Service on Render**

2. **Connect your repository** (or push this backend folder to a new repo)

3. **Set environment variables** in Render dashboard:
   - `PORT` (Render sets this automatically, but you can override)
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `CORS_ORIGIN` (your frontend URL, e.g., `https://yourdomain.com`)
   - `ADMIN_KEY` (generate a strong random string)

4. **Set build command:**

   ```
   npm install
   ```

5. **Set start command:**

   ```
   node server.js
   ```

6. **Deploy!** Render will automatically deploy on every push to your main branch.

## Database Schema

Create a `submissions` table in Supabase with the following columns:

```sql
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  document_type TEXT NOT NULL,
  document_number TEXT,
  issued_by TEXT,
  issued_on DATE,
  expires_on DATE,
  file_url TEXT,
  status TEXT NOT NULL DEFAULT 'received',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Optional: Add indexes for better query performance
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_created_at ON submissions(created_at DESC);
```

## API Endpoints

### `POST /api/v1/submissions`

Public endpoint for creating submissions. No authentication required.

**Request body:**

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "documentType": "passport",
  "documentNumber": "AB123456",
  "issuedBy": "UK Government",
  "issuedOn": "2020-01-01",
  "expiresOn": "2030-01-01",
  "fileUrl": "https://example.com/file.pdf"
}
```

**Required fields:** `fullName`, `email`, `documentType`

**Response (201):**

```json
{
  "message": "Submission received",
  "submissionId": "uuid-here"
}
```

### `GET /api/v1/submissions`

Admin endpoint to list all submissions. Requires `x-admin-key` header.

**Headers:**

```
x-admin-key: your_admin_key_here
```

**Response (200):**

```json
{
  "submissions": [
    {
      "id": "uuid",
      "full_name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "document_type": "passport",
      "status": "received",
      "created_at": "2025-01-01T00:00:00Z",
      ...
    }
  ]
}
```

**Error (401):** Returns `{"message": "Unauthorized"}` if admin key is missing or incorrect.

### `GET /api/v1/meta`

Returns API metadata (version, features). No authentication required.

**Response (200):**

```json
{
  "name": "Core Intake API",
  "version": "1.0.0",
  "features": {
    "publicSubmission": true,
    "adminRead": true,
    "authentication": false
  }
}
```

### `GET /health`

Health check endpoint. No authentication required.

**Response (200):**

```json
{
  "status": "ok"
}
```

## How to Reuse This Backend for Another Project

**Goal: Be productive in under 10 minutes**

### Step 1: Copy the Backend Folder

Copy the entire `backend/` folder to your new project.

### Step 2: Create Supabase Table

1. Create a new Supabase project (or use existing)
2. Go to SQL Editor
3. Run the SQL schema from the "Database Schema" section above
4. Adjust column names/types if needed for your use case

### Step 3: Fill in .env

1. Copy `.env.example` to `.env`
2. Add your Supabase credentials (from Supabase dashboard > Settings > API)
3. Set `CORS_ORIGIN` to your frontend URL (comma-separated for multiple)
4. Generate a strong `ADMIN_KEY` (use a password generator, 32+ characters)

### Step 4: Deploy

1. Push to your repository
2. Deploy to Render (or your preferred hosting)
3. Set environment variables in your hosting dashboard (same as `.env`)

### Step 5: Connect Frontend

1. Point your frontend to the API URL
2. For admin endpoints, include `x-admin-key` header with your `ADMIN_KEY`
3. Test with the `/api/v1/meta` endpoint first

**That's it!** Your backend is ready to accept submissions.

## Versioning & Extension

### v1.0 (Current)

**Core Intake + Admin Read**

- Public submission endpoint (no auth)
- Admin read endpoint (simple admin key)
- Generic submission structure
- No authentication, sessions, or user concepts
- Intentionally minimal for maximum flexibility

**Use v1.0 when:**

- You need a quick MVP
- You want to add your own auth layer later
- You need a simple form submission handler
- You're building an admin dashboard with basic protection

### v2.0 (Future)

**Authentication, Roles, Audit Logs**

Planned features (not implemented yet):

- JWT-based authentication
- User roles and permissions
- Audit logs for all actions
- Rate limiting
- Webhook support
- File upload handling

**When to upgrade to v2.0:**

- You need multi-user authentication
- You need role-based access control
- You need audit trails
- You're building a production system with compliance requirements

**Migration path:** v1.0 is designed to be extended, not replaced. You can add v2.0 features alongside v1.0 endpoints.

## Reusability Notes

### Generic by Design

- **Submissions are generic**: The `document_type` and `issued_by` fields allow this backend to work across different domains (identity verification, document uploads, enquiries, etc.)
- **Flexible fields**: Optional fields like `phone`, `document_number`, `file_url` can be repurposed for different use cases
- **Status workflow**: Currently uses `received` → `in_review` → `approved/rejected`. You can extend this in your database

### Frontend Independence

- **Frontends should not know about database structure**: The API maps frontend camelCase to database snake_case automatically
- **API contract is stable**: Frontends only need to know the API endpoints, not the database schema
- **No frontend dependencies**: Works with any frontend framework (React, Vue, Angular, vanilla JS, etc.)

### Authentication Strategy

- **v1.0 uses simple admin key**: The `x-admin-key` header is intentional for MVP/admin dashboards
- **No authentication baked in**: This allows you to choose your own auth strategy when needed
- **Easy to extend**: Add your own auth middleware without modifying core endpoints
- **Future-proof**: v2.0 will add proper authentication, but v1.0 will remain compatible

### Customization Points

- **Validation**: Basic validation is in place. Add more validation rules as needed
- **Error handling**: Structured error responses make it easy to handle errors in frontends
- **CORS**: Configurable via `CORS_ORIGIN` environment variable
- **Database**: Use the provided schema or adapt it to your needs

## Troubleshooting

### "Server misconfigured" error

- Check that `ADMIN_KEY` is set in your `.env` file
- Verify the key is not empty and has no extra whitespace

### CORS errors

- Verify `CORS_ORIGIN` matches your frontend URL exactly (including protocol and port)
- For development, you can temporarily set `CORS_ORIGIN=*` (not recommended for production)
- Multiple origins: Use comma-separated values: `http://localhost:8100,https://yourdomain.com`

### Database connection errors

- Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are correct
- Check that your Supabase project is active
- Ensure the `submissions` table exists with the correct schema
- Verify you're using the `service_role` key, not the `anon` key

### 401 Unauthorized on admin endpoint

- Check that `ADMIN_KEY` is set in both backend `.env` and frontend environment
- Verify the key matches exactly (no extra spaces, same case)
- Check that the `x-admin-key` header is being sent correctly

## License

This backend is designed to be copied and reused freely. No license restrictions.
