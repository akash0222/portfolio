# AKASH / WORKS — Portfolio

A responsive, multi-page React portfolio for Akash Singh, built with Vite to present career experience and freelance-ready projects.

## Files
- `index.html` — document metadata and Vite mount point
- `work.html`, `about.html`, `contact.html` — standalone pages for selected work, background, and contact
- `src/App.jsx` — shared navigation and page-specific portfolio content
- `src/main.jsx` — React entry point
- `styles.css` — responsive visual design and animation

## Development
1. Install dependencies with `npm install`.
2. Start the Vite development server with `npm run dev`.
3. Create a production build with `npm run build`.
4. Preview the production build with `npm run preview`.

The site has four pages: `/` (Home), `/work.html` (Work), `/about.html` (About), and `/contact.html` (Contact). Vite builds each page as a separate HTML entry.

## Deploy to Vercel
Import the repository in Vercel and use the Vite defaults: `npm run build` as the build command and `dist` as the output directory.

## Before publishing
- Confirm the public contact email (`abhsingh76@gmail.com`) is correct.
- Confirm the project descriptions and external links are still current.
- The brand `AKASH / WORKS` is a proposed custom brand and can be renamed in `src/App.jsx` and `index.html`.
- The site intentionally does not claim an unverified number of years of experience.
