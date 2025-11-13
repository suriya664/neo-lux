# Neo Lux Portfolio Documentation

## Overview

Neo Lux is a cinematic, dark-mode personal portfolio designed for premium launches or marketplace resale. The system blends industrial-grade imagery, copper accents, and glassmorphic UI components across Home, About, Portfolio, Project, Resume, Blog, Post, Contact, Login, Register, 404, and Coming Soon pages.

## Assets

- Imagery sources are referenced via Unsplash/Pexels CDN URLs. Replace them with licensed assets for production.
- Fonts are served through Google Fonts (Montserrat and Orbitron).
- Resume download points to ssets/docs/Neo-Lux-Resume.pdf. Replace the placeholder file with a finalized PDF.

## Scripts

ssets/js/main.js handles theme toggling, scroll-triggered animation classes, lightbox modals, slider controls, and client-side form validation with success feedback.

## Styles

ssets/css/main.css defines the copper-infused dark theme, responsive grid layouts, glassmorphic cards, and accessibility utilities (focus rings, sr-only helpers, reduced-motion friendly animations).

## Accessibility

- All images include descriptive alt text.
- Form errors announce via ria-live regions and focus transitions to first invalid field.
- Theme toggle respects saved preferences and system settings.
- Lightbox supports keyboard escape and arrow navigation.

## Customization

1. Update copy to reflect your personal story and services.
2. Swap remote images with local assets placed in ssets/images/.
3. Replace the placeholder resume and add marketplace-ready documentation as needed.
4. Integrate a real authentication backend or headless CMS for form handling.

## Build & Deployment

The site is static and can be deployed on any CDN or static host (Netlify, Vercel, GitHub Pages). Minify CSS/JS and self-host imagery for improved performance.
