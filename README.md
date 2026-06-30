# HM Blogs — Read • Learn • Inspire

A full-stack MERN blog platform with JWT (access + refresh token) authentication, an admin panel,
author dashboard, comments with replies, likes/bookmarks, dark mode, SEO-ready pages, and a
modern, premium UI built with React 19, Vite, and Tailwind CSS.

---

## Tech Stack

**Frontend:** React 19, Vite, Tailwind CSS, React Router DOM, Axios, Framer Motion, React Hook
Form, React Icons, TanStack Query, Context API, React Helmet Async, React Hot Toast

**Backend:** Node.js, Express.js, MongoDB + Mongoose, JWT (access + refresh tokens), Cloudinary,
Nodemailer, Helmet, express-rate-limit, express-mongo-sanitize, xss-clean

**Deployment:** Frontend → Vercel · Backend → Render · Database → MongoDB Atlas

---

## Project Structure

```
HM-Blogs/
├── backend/
│   ├── config/          # DB + Cloudinary config
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Auth, error handling, rate limiting, uploads
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routers
│   ├── utils/           # Tokens, email, seed script, ApiError
│   ├── validators/      # express-validator rules
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/             # Axios instance + API service modules
│   │   ├── components/      # common, layout, blog, home, dashboard, admin
│   │   ├── context/          # Auth + Theme context
│   │   ├── pages/             # Route-level pages (auth, dashboard, admin, legal)
│   │   ├── utils/             # Formatters and helpers
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── .env.example
└── README.md
```

---

## Getting Started

### 1. Backend Setup

```bash
cd backend
cp .env.example .env       # fill in your real values
npm install
npm run seed                # optional: populate sample data
npm run dev                 # starts on http://localhost:5000
```

**Required environment variables** (see `.env.example`):
- `MONGO_URI` — MongoDB Atlas connection string
- `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` — long random strings
- `CLOUDINARY_*` — for image uploads
- `SMTP_*` — for password reset emails (optional in dev; logs a warning if unset)
- `CLIENT_URL` — frontend origin for CORS (e.g. `http://localhost:5173`)

### 2. Frontend Setup

```bash
cd frontend
cp .env.example .env       # set VITE_API_URL
npm install
npm run dev                 # starts on http://localhost:5173
```

### 3. Seed Data & Demo Logins

Running `npm run seed` in `backend/` creates:
- **Admin:** `admin@hmblogs.com` / `Admin@123`
- **Author:** `sarah@hmblogs.com` / `Author@123`

It also creates sample categories, tags, and published blog posts so the site isn't empty on
first run.

---

## Key Features Implemented

- JWT auth with **httpOnly refresh token cookie** + short-lived access token, automatic silent
  refresh via Axios interceptor
- Role-based access control (`user`, `author`, `admin`)
- Full blog CRUD with Cloudinary cover image upload, drafts/published/archived status, featured
  flag, auto-computed reading time, view counter
- Categories & tags management (admin)
- Threaded comments with replies, likes, edit/delete
- Likes & bookmarks on blogs
- Author follow/unfollow, public author profile pages
- Reading history tracking
- Newsletter subscribe/unsubscribe + admin subscriber export
- Notifications model (comment/reply/like/follow events) with read/unread state
- Admin analytics dashboard (totals, top blogs, recent users)
- Full dark mode system: system-theme detection, manual toggle, persisted in localStorage,
  smooth transitions across all components
- SEO: per-page meta tags, Open Graph & Twitter cards via `react-helmet-async`, `robots.txt`,
  PWA manifest
- Security: Helmet, CORS allow-list, rate limiting (general + stricter auth limiter), Mongo
  query sanitization, XSS cleaning, bcrypt password hashing, input validation
- UX: skeleton loaders, pagination, reading progress bar, back-to-top button, responsive design,
  Framer Motion animations throughout

---

## API Overview

All routes are prefixed with `/api`.

| Resource | Routes |
|---|---|
| Auth | `POST /auth/register`, `/login`, `/refresh`, `/logout`, `GET /auth/me`, `/auth/forgot-password`, `/auth/reset-password/:token` |
| Blogs | `GET /blogs`, `GET /blogs/trending`, `GET /blogs/me/all`, `GET /blogs/admin/all`, `GET /blogs/:slug`, `POST /blogs`, `PUT /blogs/:id`, `DELETE /blogs/:id`, `POST /blogs/:id/like`, `POST /blogs/:id/bookmark` |
| Categories | `GET /categories`, `POST /categories`, `PUT /categories/:id`, `DELETE /categories/:id` |
| Tags | `GET /tags`, `POST /tags`, `DELETE /tags/:id` |
| Comments | `GET /comments/:blogId`, `POST /comments/:blogId`, `PUT /comments/:id`, `DELETE /comments/:id`, `POST /comments/:id/like`, `GET /comments/admin/all` |
| Users | `GET /users/:id`, `PUT /users/profile`, `PUT /users/change-password`, `GET /users/bookmarks`, `GET /users/history`, `POST /users/:id/follow`, `GET /users` (admin), `PUT /users/:id/role` (admin), `DELETE /users/:id` (admin) |
| Notifications | `GET /notifications`, `PUT /notifications/:id/read`, `PUT /notifications/read-all` |
| Newsletter | `POST /newsletter/subscribe`, `POST /newsletter/unsubscribe`, `GET /newsletter` (admin) |
| Admin | `GET /admin/analytics` |

---

## Deployment Notes

**Frontend (Vercel):** set `VITE_API_URL` to your deployed backend URL + `/api`. The included
`vercel.json` adds an SPA rewrite so client-side routes don't 404 on refresh.

**Backend (Render):** use the included `render.yaml` as a starting point, or configure manually.
Set `CLIENT_URL` to your deployed frontend URL so CORS allows requests from it.

**Database (MongoDB Atlas):** create a free cluster, add a database user, allow network access
from your deployment platform (or `0.0.0.0/0` for simplicity), and use that connection string as
`MONGO_URI`.

---

## Notes & Known Limitations

This is a strong, working foundation for a production blog platform, not an exhaustive
implementation of every feature in a wishlist. A few things intentionally kept simple that you
may want to extend before a real launch:
- The contact form currently simulates submission client-side; wire it to a real backend
  endpoint + email service if you need actual delivery.
- The blog editor uses a plain HTML textarea for content; swap in a rich text/Markdown editor
  (e.g. TipTap, Quill, or react-markdown) for a better authoring experience.
- Sitemap.xml/RSS feed generation isn't automated; generate these server-side from published
  blogs if SEO crawling at scale matters to you.
- Notification delivery is stored in the DB but there's no real-time push (e.g. WebSockets) —
  the bell icon would need to be wired into the navbar and polled or subscribed to for a live
  feed.

## License

MIT — free to use and modify for personal or commercial projects.
