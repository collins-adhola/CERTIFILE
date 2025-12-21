# Core Intake API v3.0

A standalone, reusable backend API for handling form submissions with admin review capabilities and Supabase Auth authentication.

## What This Backend Is

This is a simple, production-ready Node.js/Express API that provides:

- **Public submission endpoint**: Accept form submissions from any frontend
- **Admin review endpoint**: View all submissions (protected with Supabase Auth JWT tokens)
- **Admin authentication**: Supabase Auth JWT verification with email allowlist
- **Metadata endpoint**: Check API version and feature flags

**This backend uses Supabase Auth** - v1.0 is a stable baseline (admin-key). v2.0 introduced custom JWT auth. v3.0 uses Supabase Auth.

## What Problems It Solves

- **Form submission handling**: Collect structured data from contact forms, enquiry forms, etc.
- **Admin dashboard support**: Provide data for admin interfaces to review submissions
- **Secure authentication**: Supabase Auth JWT verification (no password management in backend)
- **Reusability**: Generic design allows reuse across different projects and domains
- **Quick deployment**: Minimal setup required, works with Supabase out of the box

## Required Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
PORT=5050                                    # Server port (default: 5050)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_key_here     # Secret! Never expose to frontend
CORS_ORIGIN=http://localhost:8100           # Allowed frontend origins (comma-separated)

# Admin Authentication (v2.0)
ADMIN_EMAIL=admin@certifile.co.uk          # Admin email for login
ADMIN_PASSWORD_HASH=bcrypt_hash_here       # Bcrypt hash of admin password
JWT_SECRET=long_random_string              # Secret for signing JWT tokens
JWT_EXPIRES_IN=12h                         # Token expiration (e.g., "12h", "7d")
```

See `.env.example` for detailed comments on each variable.

### Generating Password Hash

To generate a bcrypt hash for `ADMIN_PASSWORD_HASH`, run:

```bash
node -e "console.log(require('bcryptjs').hashSync('your_password_here', 10))"
```

Replace `'your_password_here'` with your actual password. Copy the output to `ADMIN_PASSWORD_HASH` in your `.env` file.

### Generating JWT Secret

To generate a secure JWT secret, run:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output to `JWT_SECRET` in your `.env` file.

## How to Run Locally

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**

   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   # Don't forget to generate ADMIN_PASSWORD_HASH and JWT_SECRET!
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
   - `ADMIN_EMAIL` (your admin email)
   - `ADMIN_PASSWORD_HASH` (generate using the command above)
   - `JWT_SECRET` (generate using the command above)
   - `JWT_EXPIRES_IN` (e.g., `12h`)

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

### `POST /api/v1/auth/login`

Admin login endpoint. Returns JWT token for authenticated requests.

**Request body:**

```json
{
  "email": "admin@certifile.co.uk",
  "password": "your_password"
}
```

**Response (200):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "12h"
}
```

**Error (401):** Returns `{"message": "Invalid credentials"}` if email or password is incorrect.

**Rate Limited:** 10 requests per 15 minutes per IP address.

### `GET /api/v1/auth/me`

Get current authenticated user info. Requires JWT token.

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "email": "admin@certifile.co.uk",
  "role": "admin"
}
```

**Error (401):** Returns `{"message": "Authentication required"}` if token is missing or invalid.

### `GET /api/v1/submissions`

Admin endpoint to list all submissions. Requires JWT token.

**Headers:**

```
Authorization: Bearer <token>
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

**Error (401):** Returns `{"error": {"message": "Unauthorized"}}` if token is missing or invalid.

**Error (403):** Returns `{"error": {"message": "Forbidden"}}` if token is valid but email is not in `ADMIN_EMAIL_ALLOWLIST`.

### `GET /api/v1/meta`

Returns API metadata (version, features). No authentication required.

**Response (200):**

```json
{
  "name": "Core Intake API",
  "version": "3.0.0",
  "authProvider": "supabase",
  "features": {
    "publicSubmission": true,
    "adminRead": true,
    "authentication": true
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

## v3.0 Supabase Auth Setup

### 1. Get Your Supabase URL

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to **Settings** > **API**
3. Copy your **Project URL** (format: `https://<project-ref>.supabase.co`)
4. Add it to your `.env` file as `SUPABASE_URL`

### 2. Add Redirect URLs in Supabase

1. In Supabase dashboard, go to **Authentication** > **URL Configuration**
2. Add your frontend URLs to **Redirect URLs**:
   - `http://localhost:8100` (for local development)
   - `https://www.certifile.co.uk` (for production)
3. Save changes

### 3. Create Admin User in Supabase

1. Go to **Authentication** > **Users** in Supabase dashboard
2. Click **Add user** or **Invite user**
3. Enter admin email address (e.g., `admin@certifile.co.uk`)
4. Set a secure password
5. **Important:** Make sure the email is confirmed (check the "Email Confirmed" checkbox)
6. The user will receive an email to confirm their account

**Alternative: Create user via SQL (for testing)**

```sql
-- In Supabase SQL Editor
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@certifile.co.uk',
  crypt('your_password_here', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW()
);
```

### 4. Configure Admin Email Allowlist

In your backend `.env` file, set `ADMIN_EMAIL_ALLOWLIST`:

```bash
ADMIN_EMAIL_ALLOWLIST=admin@certifile.co.uk,admin2@certifile.co.uk
```

- Use comma-separated list for multiple admins
- Email addresses are case-insensitive
- Only users with emails in this list can access admin endpoints

## Using Supabase Auth Tokens (v3.0)

### 1. Get Supabase Auth Token (Frontend)

The frontend should use Supabase Auth client to authenticate:

```javascript
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Sign in with email/password
const { data, error } = await supabase.auth.signInWithPassword({
  email: "admin@certifile.co.uk",
  password: "your_password",
});

// Get the access token
const accessToken = data.session.access_token;
```

### 2. Use Token for Admin Requests

```bash
curl http://localhost:5050/api/v1/submissions \
  -H "Authorization: Bearer <supabase-access-token>"
```

### 3. Testing with curl

**Test without token (should return 401):**

```bash
curl http://localhost:5050/api/v1/submissions
```

Response:

```json
{
  "error": {
    "message": "Unauthorized"
  }
}
```

**Test with token but email not in allowlist (should return 403):**

```bash
curl http://localhost:5050/api/v1/submissions \
  -H "Authorization: Bearer <valid-supabase-token-but-email-not-in-allowlist>"
```

Response:

```json
{
  "error": {
    "message": "Forbidden"
  }
}
```

**Test with allowed admin token (should return 200):**

```bash
curl http://localhost:5050/api/v1/submissions \
  -H "Authorization: Bearer <supabase-token-for-admin@certifile.co.uk>"
```

Response:

```json
{
  "submissions": [...]
}
```

## Using JWT Tokens (v2.0 - Deprecated)

**⚠️ Note:** v2.0 custom JWT authentication is deprecated. The following is for reference only.

### 1. Login to Get Token

```bash
curl -X POST http://localhost:5050/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@certifile.co.uk", "password": "your_password"}'
```

### 2. Use Token for Admin Requests

```bash
curl http://localhost:5050/api/v1/submissions \
  -H "Authorization: Bearer <v2-custom-jwt-token>"
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
4. Set `ADMIN_EMAIL` to your admin email
5. Generate `ADMIN_PASSWORD_HASH` using the command in "Generating Password Hash"
6. Generate `JWT_SECRET` using the command in "Generating JWT Secret"
7. Set `JWT_EXPIRES_IN` (e.g., `12h`)

### Step 4: Deploy

1. Push to your repository
2. Deploy to Render (or your preferred hosting)
3. Set environment variables in your hosting dashboard (same as `.env`)

### Step 5: Connect Frontend

1. Point your frontend to the API URL
2. Implement login flow using `POST /api/v1/auth/login`
3. Store JWT token securely
4. Include `Authorization: Bearer <token>` header in admin requests
5. Test with the `/api/v1/meta` endpoint first

**That's it!** Your backend is ready to accept submissions and handle admin authentication.

## Versioning & Extension

### v1.0 (Stable Baseline)

**Core Intake + Admin Read (Simple Admin Key)**

- Public submission endpoint (no auth)
- Admin read endpoint (simple admin key via `x-admin-key` header)
- Generic submission structure
- No authentication, sessions, or user concepts

**Status:** v1.0 is a stable baseline (admin-key). v2.0 introduces JWT auth.

### v2.0 (Superseded by v3.0)

**Core Intake + Admin Read + Custom JWT Authentication**

- Public submission endpoint (no auth)
- Admin read endpoint (custom JWT token required)
- JWT-based authentication with bcrypt password hashing
- Rate limiting on login endpoint
- Security headers via Helmet
- No secrets exposed to frontend

**Status:** v2.0 is superseded by v3.0. v2.0 auth endpoints are kept for backward compatibility but are not used for admin submissions in v3.0.

### v3.0 (Current)

**Core Intake + Admin Read + Supabase Auth**

- Public submission endpoint (no auth)
- Admin read endpoint (Supabase Auth JWT token required)
- Supabase Auth JWT verification using JWKS
- Email-based admin allowlist
- Multiple admin users via Supabase dashboard
- No password management in backend (handled by Supabase)

**Use v3.0 when:**

- You want to use Supabase Auth for user management
- You need multiple admin users without backend changes
- You want password reset, email verification, etc. handled by Supabase
- You're building a system that integrates with Supabase Auth

**Migration from v2.0:**

- Update frontend to use Supabase Auth client instead of custom login
- Remove `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `JWT_SECRET` from backend `.env` (optional, kept for backward compatibility)
- Add `ADMIN_EMAIL_ALLOWLIST` to backend `.env`
- Create admin users in Supabase dashboard
- Frontend sends Supabase JWT tokens to backend endpoints

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

- **v2.0 uses JWT tokens**: Secure, stateless authentication with token expiration
- **No secrets in frontend**: Password hash and JWT secret stay server-side only
- **Easy to extend**: Add your own auth middleware without modifying core endpoints
- **Future-proof**: v3.0 will add more features, but v2.0 will remain compatible

### Customization Points

- **Validation**: Basic validation is in place. Add more validation rules as needed
- **Error handling**: Structured error responses make it easy to handle errors in frontends
- **CORS**: Configurable via `CORS_ORIGIN` environment variable
- **Database**: Use the provided schema or adapt it to your needs
- **Token expiration**: Configurable via `JWT_EXPIRES_IN` environment variable

## Troubleshooting

### "Server misconfigured" error

- Check that `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, and `JWT_SECRET` are set in your `.env` file
- Verify the values are not empty and have no extra whitespace

### "Invalid credentials" on login

- Verify `ADMIN_EMAIL` matches exactly (case-insensitive)
- Check that `ADMIN_PASSWORD_HASH` was generated correctly using bcrypt
- Ensure you're using the correct password that was hashed

### 401 Unauthorized on admin endpoints

- Check that you're including the `Authorization: Bearer <token>` header
- Verify the token hasn't expired (check `JWT_EXPIRES_IN` setting)
- Ensure `JWT_SECRET` matches between token generation and verification
- Try logging in again to get a fresh token

### "Too many login attempts" error

- Rate limiting is active: 10 requests per 15 minutes per IP
- Wait 15 minutes or use a different IP address
- This is a security feature to prevent brute force attacks

### CORS errors

- Verify `CORS_ORIGIN` matches your frontend URL exactly (including protocol and port)
- For development, you can temporarily set `CORS_ORIGIN=*` (not recommended for production)
- Multiple origins: Use comma-separated values: `http://localhost:8100,https://yourdomain.com`
- Ensure `Authorization` header is in `allowedHeaders` (already configured)

### Database connection errors

- Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are correct
- Check that your Supabase project is active
- Ensure the `submissions` table exists with the correct schema
- Verify you're using the `service_role` key, not the `anon` key

## Security Best Practices

1. **Never commit `.env` files** - Use `.env.example` as a template
2. **Use strong passwords** - Generate secure passwords for admin accounts
3. **Rotate JWT secrets** - Change `JWT_SECRET` periodically in production
4. **Set appropriate token expiration** - Use `JWT_EXPIRES_IN` to limit token lifetime
5. **Use HTTPS in production** - Never send tokens over unencrypted connections
6. **Store tokens securely** - In frontend, use secure storage (consider httpOnly cookies)
7. **Monitor login attempts** - Rate limiting helps, but monitor for suspicious activity

## License

This backend is designed to be copied and reused freely. No license restrictions.
