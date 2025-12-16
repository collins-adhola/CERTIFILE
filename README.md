io

# CertiFile Frontend MVP

## Project Goals

### Design & Brand

- **Professional, minimal brand look** with neutral palette and strong typographic hierarchy
- Clean, modern aesthetic that conveys trust and professionalism

### Performance & Accessibility

- **Fast loading** with optimized assets and efficient code
- **Accessible** design following WCAG guidelines
- **Mobile-first** approach with responsive design
- **Large tap targets** for better mobile usability

### Navigation & Structure

Clear navigation sections:

- **Home** - Landing page with hero section
- **How It Works** - Process explanation
- **Services** - Service offerings
- **Pricing** - Pricing plans and options
- **FAQ** - Frequently asked questions
- **Contact** - Contact information and forms

### User Experience

- **Sticky header** for easy navigation
- **Smooth scrolling** between sections
- **Crisp spacing** and clean layout
- **Responsive design** that works across all devices

## Lead flow: Pricing → Contact (no backend yet)

- **Pricing plans**:
  - **Pay-as-you-go** – From £25 / check.
  - **Company pack** – From £149 / entity.
- **Plan selection routing**:
  - Clicking **“Choose”** on Pay-as-you-go routes (or will route) to `"/contact?plan=payg#book-demo"`.
  - Clicking **“Choose”** on Company pack routes (or will route) to `"/contact?plan=company-pack#book-demo"`.
- **Single entry-point form**:
  - The **Contact / Book a demo** form is the sole lead capture point for all plans and enquiries.
  - The form collects **Full Name, Email, Phone, Company Name, Service Required, Message**.
  - The **Service Required** field reflects the selected plan where possible (for example: **“IDV – Pay-as-you-go”** or **“IDV – Company pack”**).
  - The **Message** field is used to capture practical details such as number of directors/PSCs, urgency, and any required Companies House filings.
- **Netlify Form implementation**:
  - The form is wired as a Netlify form using `name="contact"`, `data-netlify="true"`, and a hidden `form-name` input.
  - Submissions are stored in the **Netlify Forms** dashboard.
  - Netlify is configured to send email notifications to the Zoho inbox (for example `info@certifile.co.uk`), so every submission arrives as an email with all captured fields.
- **Current operating model (no backend)**:
  - There is **no dedicated backend, client portal, or online payments** at this stage.
  - All enquiries are handled manually over email and calls.
  - Pricing on the site is **indicative**; final scope and fees are confirmed in writing (for example via engagement letter, proposal, or email).
  - Identity verification and Companies House filings are delivered, but onboarding, invoicing, and reporting are managed offline.

### Future backend plan

- **Lightweight backend** (for example Supabase or similar) will later provide authenticated client and firm logins.
- It will store **checks, reports, and Companies House filings** in a structured way.
- It will add **online payments** for Pay-as-you-go and bundle options.
- The current, simple lead flow is designed so this backend can be introduced later **without changing the public-facing UX**.

## User Journey & Lead Capture Flow

### Pricing → Plan Selection → Plan Detail → Enquiry Submission Flow

CertiFile uses a simple, conversion-focused flow for collecting enquiries related to identity verification plans.

- **1. Visitor views pricing**
  - On the pricing section, users can choose between:
    - **Pay-as-you-go ID Checks**
    - **Company Pack (multi-director/PSC)**
  - Each **“Choose”** button navigates to a dedicated plan page:

    | Pricing option | Route            |
    | -------------- | ---------------- |
    | Pay-as-you-go  | `/plans/payg`    |
    | Company Pack   | `/plans/company` |

- **2. Visitor lands on a dedicated plan detail page**
  - Each plan page contains:
    - Plan-specific value proposition
    - A short **“How it works”** explanation
    - **What’s included** and pricing clarity
    - A small, relevant FAQ
    - A focused enquiry form at the bottom
  - This structure is designed to build trust and give potential clients enough context before submitting their details.

- **3. Visitor submits a plan-specific enquiry form**
  - Each plan page ends with a form that posts to **Netlify Forms**.
  - The form:
    - Uses Netlify’s built-in form handling (no backend required)
    - Sends submissions to the **Netlify Dashboard → Forms**
    - Sends an email notification to the team
    - Includes a hidden field that logs which plan the user selected, for example:

      ```html
      <input type="hidden" name="plan" value="Pay-as-you-go ID Check" />
      ```

  - This ensures every notification email includes:
    - The user’s details
    - Their message
    - Which plan they were enquiring about

- **4. Internal workflow**
  - Once the form is submitted:
    - Netlify logs it under **Forms**
    - Email notifications are sent
    - The team replies via **Zoho Mail**
  - No backend is required until:
    - Payment processing
    - Secure client onboarding
    - Dashboard login
    - IDV integrations
    - Companies House filing workflow
  - These will be implemented later using a simple backend stack.

- **5. Future backend integration (planned)**
  - After the frontend user journey is complete, backend upgrades will support:
    - Account creation and login
    - Client dashboards
    - ID verification initiation
    - Payment and invoicing
    - Document uploads
    - Companies House filing automation
    - Admin-only review workflow
  - The current frontend pages are structured so they can adopt this backend capability without a disruptive UX change.

- **Summary of the current flow**

  Pricing Page  
  ↓  
  User selects a plan  
  ↓  
  Dedicated Plan Detail Page (`/plans/payg` or `/plans/company`)  
  ↓  
  Plan-specific Netlify form  
  ↓  
  Submission goes to:
  - Netlify Dashboard → Forms
  - Email notification  
    ↓  
    Team follows up manually via Zoho Mail

This structure is designed to maximise trust and conversion while keeping operational complexity low.

## Technology Stack

- **Frontend Framework**: Angular with Ionic
- **Styling**: SCSS with custom theme variables
- **Mobile**: Capacitor for native mobile capabilities
- **Build**: Angular CLI with optimized production builds

## Getting Started

```bash
cd frontend
npm install
npm start
ionic serve
```

## Development

- Run `ng serve` for development server
- Run `ng build` for production build
- Run `ng test` for unit tests



## Certifile Backend – MVP Specification

### 1. Purpose

Certifile is a secure backend service for **collecting, storing and verifying identity and document data** (e.g. IDs, certificates, licences) submitted via web forms or future frontends.

The MVP focuses on:

- Accepting submissions from public forms (Certifile website).
- Storing personal & document data securely in a structured database.
- Allowing internal users (admins) to review and change the status of submissions.
- Recording a basic audit trail for key actions.

---

### 2. MVP Objectives

1. **Single source of truth**  
   All submitted IDs/documents and related personal data are stored in a single PostgreSQL database.

2. **Simple verification workflow**  
   Each submission can move through clear statuses:  
   `received → in_review → approved / rejected`.

3. **Basic access control**  
   - Public, unauthenticated endpoint to create a submission.  
   - Authenticated admin endpoints to list, review and update statuses.

4. **Auditability**  
   Record who did what and when (at least for admin actions on submissions).

---

### 3. In-Scope Features (MVP)

#### 3.1 Public Form Submission API

- `POST /api/v1/submissions`
  - Used by the frontend form(s).
  - Accepts applicant details and document metadata.
  - Optionally includes a `fileUrl` (actual file storage can be handled by another service at first).
  - Automatically sets status to `received`.
  - Returns a reference ID for tracking.

**Example fields (can be adjusted):**
- Applicant:
  - `fullName`
  - `email`
  - `phone` (optional)
- Document:
  - `documentType` (passport, ID card, certificate, etc.)
  - `documentNumber` (optional)
  - `issuedBy` / `issuedCountry`
  - `issuedOn` (optional)
  - `expiresOn` (optional)
  - `fileUrl` (optional – link/path to stored file)

#### 3.2 Admin Authentication

- `POST /api/v1/auth/register` (can be admin-seeded only in production)
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `GET /api/v1/auth/me`

Basics:
- JWT-based authentication (access + refresh tokens).
- Roles: `admin` (for now you can keep just admins; later add `reviewer`, `client`, etc.).

#### 3.3 Admin Submission Management

All endpoints below require a valid admin JWT.

- `GET /api/v1/submissions`
  - List submissions.
  - Filters: `status`, `email`, date range.

- `GET /api/v1/submissions/:id`
  - Fetch full details of a single submission.

- `PATCH /api/v1/submissions/:id`
  - Update fields such as internal notes or corrected metadata (not personal data rules).

- `POST /api/v1/submissions/:id/status`
  - Change status along the workflow:
    - From `received` → `in_review`
    - From `in_review` → `approved` or `rejected`
  - Body includes:
    ```json
    {
      "status": "in_review | approved | rejected",
      "reason": "Optional reason, especially on rejection"
    }
    ```

#### 3.4 Audit Log

- Automatically create an audit record when:
  - A submission is created.
  - An admin updates a submission status.
  - An admin edits key fields on a submission.

- Admin endpoint:
  - `GET /api/v1/audit-logs`
    - Filters: `submissionId`, `performedBy`, `action`, date range.

---

### 4. Data Model (Conceptual)

MVP Prisma-style models (names can be adjusted):

**User**
- `id`
- `email`
- `passwordHash`
- `name`
- `role` (`admin`)
- `createdAt`
- `updatedAt`

**Submission**
- `id`
- `fullName`
- `email`
- `phone` (optional)
- `documentType`
- `documentNumber` (optional)
- `issuedBy` (optional)
- `issuedOn` (optional)
- `expiresOn` (optional)
- `fileUrl` (optional)
- `status` (`received`, `in_review`, `approved`, `rejected`)
- `rejectionReason` (nullable)
- `internalNotes` (nullable)
- `createdAt`
- `updatedAt`

**AuditLog**
- `id`
- `submissionId` (FK to Submission, nullable if action is global)
- `performedBy` (FK to User)
- `action` (string, e.g. `"SUBMISSION_CREATED"`, `"STATUS_CHANGED"`)
- `metadata` (JSON)
- `createdAt`

---

### 5. Tech Stack (Implementation Target)

- **Runtime:** Node.js (LTS)
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Auth:** JWT (access + refresh)
- **Validation:** Zod (or similar)
- **Testing:** Jest

---

### 6. Out of Scope for MVP (Future Phases)

- File upload and storage (S3/GCS) – for now, MVP just stores a `fileUrl`.
- Complex roles/permissions (reviewer vs auditor vs client).
- Customer-facing dashboard to track their submission.
- Integrations with third-party verification providers.
- Full compliance features (DSAR flows, retention policies, etc.) – only basic privacy/security in MVP.
