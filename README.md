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
