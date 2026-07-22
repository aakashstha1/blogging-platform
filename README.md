# Quill — Full-Stack Blogging Platform

A Medium-style blogging platform where users can write, read, and discover posts through a personalized recommendation feed and a trending page.

## Tech Stack

**Frontend:** React, TanStack Query, React Router, shadcn/ui, Tailwind CSS
**Backend:** Node.js, Express, MongoDB (Mongoose)
**Other:** JWT Authentication, Cloudinary (image uploads), Zod (validation), node-cron

## Features

- User authentication with JWT (access + refresh tokens)
- Create, edit, and publish blog posts with cover images
- Categories, tags, likes, and comments
- Debounced live search
- Trending feed — ranked using a time-decayed "hot score" based on views, likes, and comments
- Personalized recommendation feed — built with a custom TF-IDF + cosine similarity engine over user engagement history
- Route-specific rate limiting and centralized error handling

## Architecture

The backend is organized by feature module rather than by technical layer:

```
modules/
  auth/
  user/
  post/
  category/
  tag/
  like/
  comment/
  view/
  trending/
  recommendation/
```

Each module follows: `route → middleware → controller → service → model`

- **Middleware** — auth verification, role checks, Zod validation, rate limiting
- **Controller** — parses requests, calls services
- **Service** — business logic
- **Model** — Mongoose schema

## Recommendation Engine

Posts are tokenized and converted into TF-IDF vectors, refreshed nightly via a cron job. A user's profile is built from their recent views, likes, and comments (weighted by effort — comments > likes > views), then compared against candidate posts using cosine similarity. New users or posts fall back to the trending feed.

## Getting Started

```bash
# Backend
cd backend
pnpm install
pnpm dev

# Frontend
cd frontend
npm install
npm run dev
```

Create a `.env` file in `backend/` based on `.env.example` with your MongoDB URI, JWT secrets, and Cloudinary credentials.

## License

ISC
