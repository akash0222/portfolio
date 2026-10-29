# AKASH / WORKS — Portfolio

A responsive, six-page React portfolio for Akash Singh, built with Vite to present career experience and freelance-ready projects.

## Files
- `index.html`, `work.html`, `about.html`, `skills.html`, `services.html`, `contact.html` — standalone page entry points with page-specific metadata
- `src/App.jsx` — shared navigation, page routing, project filters, theme, and enquiry form
- `src/main.jsx` — React entry point
- `styles.css` — shared responsive visual design system
- `public/assets/` — local Scheduly and Result Generator showcase mockups
- Open Graph and Twitter share images use a cropped, externally hosted JPG URL
- `public/resume.pdf` — résumé download
- `api/contact.js` — server-side enquiry validation and Resend email delivery
- `public/robots.txt` and `public/sitemap.xml` — crawler directives and all six page URLs
- `scripts/test-contact-api.mjs` — server endpoint regression tests
- `.github/workflows/ci.yml` — automatic build and enquiry API verification on pushes and pull requests

## Development
1. Install dependencies with `npm install`.
2. Start development with `npm run dev`.
3. Run a production build, validate page output, and run nine contact API tests with `npm run check`.
4. Run only the API tests with `npm run test:api`.
5. Preview the production build with `npm run preview`.

The site has six standalone pages: `/` (Home), `/work.html` (Work), `/about.html` (About), `/skills.html` (Skills), `/services.html` (Services), and `/contact.html` (Contact).

## Deploy to Vercel
Use `npm run build` as the build command and `dist` as the output directory. GitHub Actions runs `npm run check` for pushes and pull requests to `main`.

## Contact form delivery
The enquiry form submits to `/api/contact` and sends the enquiry to `CONTACT_TO_EMAIL` using Resend.

Configure these Vercel environment variables for Production (and Preview if testing previews):
- `RESEND_API_KEY`: a private Resend API key with permission to send email.
- `RESEND_FROM_EMAIL`: a sender address on a domain verified in Resend, e.g. `AKASH / WORKS <enquiries@your-verified-domain.com>`.
- `CONTACT_TO_EMAIL`: destination inbox; currently defaults to `abhsingh76@gmail.com`.

Never put the Resend API key in client-side code or commit it to GitHub. If configuration is missing or delivery fails, the form displays an error and offers a pre-filled email draft fallback. The production contact form requires `RESEND_API_KEY` and `RESEND_FROM_EMAIL` to be configured in Vercel to send enquiries automatically. The endpoint's in-memory rate limit is best-effort per warm serverless instance; sustained public traffic should use a shared rate-limit store or edge/WAF rule.

## Before publishing
- Confirm that the public contact email is correct.
- Confirm each project description and live link is current.
- The site intentionally does not claim an unverified number of years of experience.
