# Flock — Website

This repository contains a premium, custom editorial website scaffold for Flock Coffee House. It is intentionally content-light where the business must provide photography, opening hours and contact details.

What I created:
- index.html — complete accessible, responsive layout following the brief
- assets/css/style.css — editorial styles, responsive rules, reduced-motion support
- assets/js/main.js — small interactive behaviors (menu, tabs, carousel)

Placeholders:
- Replace the SVG placeholders in index.html with Flock's high-quality photos (hero and experience images). Use responsive images (srcset / picture) and optimized WebP/JPEG.
- Update the opening-hours area, phone, email and social links in the Contact section.

Hosting:
- This is plain static HTML/CSS/JS and can be hosted on GitHub Pages, Netlify, Vercel, etc.

Accessibility & Performance notes:
- Respect prefers-reduced-motion — animations are disabled for users who request reduced motion.
- Images should be lazy-loaded and delivered in modern formats for best performance.

Next steps I can take directly:
- Add image components (responsive <picture> markup) if you provide photography.
- Add a CMS-friendly structure (Netlify CMS / Forestry / Sanity) so staff can edit menu and hours.
- Create deploy configuration (GitHub Actions) for automatic builds and image optimization.

If you'd like, I can now:
- Replace the SVG placeholders with provided photos and tune typography/spacing after you review.
- Add editable JSON data files for menu & contact info so the owner can update without editing HTML.
