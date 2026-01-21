# Coding Portfolio

Live site: **https://coding-portfolio00.vercel.app/**

This is my personal portfolio web app. I built it to showcase my experience, projects, and the tools I like working with, while also giving me a place to experiment with interactive UI and scroll-based motion.

## What this site showcases

- **Experience timeline** with scroll-driven animation
- **Projects** section with highlights and links
- **Skills & technologies** overview
- **Contact form** backed by a Next.js API route (SMTP email)
- **Custom visuals/motion** using GSAP + ScrollTrigger and my background effects components

## How I built it

- **Next.js (App Router)** for routing, server rendering, and API routes
- **React** for the UI components
- **Modular CSS** for styling and component-level layout
- **GSAP + ScrollTrigger** for smooth section reveals and scroll-scrubbed animations
- **Vercel** for deployment and preview builds

## Run it locally

```bash
npm install
npm run dev
```

Then open: http://localhost:3000

## Environment variables (contact form)

The contact API route (`app/api/contact/route.ts`) sends email through SMTP. Create a local `.env.local` (and **do not commit it**) with:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `CONTACT_TO`
- `CONTACT_FROM`

## License / reuse

This is my personal portfolio. Feel free to use this repo for learning or inspiration, but please don’t impersonate me or copy the content verbatim.
