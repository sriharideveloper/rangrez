# Rangrez Henna E-Commerce Platform

Welcome to the Rangrez Henna codebase documentation. This document serves to explain the structure of this Next.js 14 Web Application.

## Architecture & Stack

- **Framework**: Next.js (App Router, React server components)
- **Database / Backend**: Supabase (PostgreSQL, Edge Functions, Row Level Security)
- **Styling**: SCSS, Tailwind CSS, Framer Motion for elegant GSAP-like animations
- **State Management**: Zustand (`store/cartStore.js`)
- **Payments**: Razorpay Server & Client APIs (`utils/razorpay.js`, `app/api/razorpay/`)
- **Web App Features**: PWA Configuration (Next-PWA)

## Folder Structure

- `app/` - The core application routing. Contains both public-facing pages (`/shop`, `/about`, `/checkout`) and protected admin routes (`/admin`). Includes SEO elements (`opengraph-image`, `sitemap`, `robots.txt`).
- `components/` - Shared UI logic. Includes global layout components (`Navbar`, `Footer`, `CartDrawer`), UI enhancements (`SmoothScroller`, `SplitText`), and interactive elements ("Bits UI").
- `lib/supabase/` - All data models acting as the database ORM abstracting Supabase interactions for `orders`, `products`, `clientUpload`, etc.
- `public/` - Static assets including fonts, brand images, and Next.js PWA required files.
- `store/` - Zustand global state managers (like Cart and Session).
- `archived_sql/` - Historical database migrations and SQL setup logs for Supabase schemas. 
- `documentation/` - All technical project logic and licensing documentation rests here.

## Deployment Information

Optimized for Vercel edge deployment using Supabase connection pooling.

---
*Designed & Built by Imperium & Co. / Srihari Muralikrishnan*