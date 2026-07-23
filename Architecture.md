# Architecture

## Overview

The backend is a Node.js/Express REST API for **Quill**, a blogging platform. It's organized by **feature module** rather than by technical layer — every domain concept (auth, posts, comments, etc.) owns its own folder containing everything related to it.

## Tech Stack

| Concern              | Choice                                   |
| --------------------- | ----------------------------------------- |
| Runtime / Framework   | Node.js, Express 5                        |
| Database              | MongoDB via Mongoose                      |
| Auth                  | JWT (access + refresh tokens), bcryptjs   |
| Validation            | Zod                                       |
| File uploads          | Multer + Cloudinary                       |
| Rate limiting         | express-rate-limit                        |
| Scheduled jobs        | node-cron                                 |
| Slugs                 | slugify                                   |

## Folder Structure

```
backend/
  app.js                  # Express app setup, route mounting, global middleware
  index.js                # Entry point: connects DB, starts cron, starts server
  config/
    db-config.js          # MongoDB connection
  middlewares/
    auth.middleware.js     # JWT verification (isAuthenticated)
    role.middleware.js     # RBAC (authorizeRoles)
    validate.middleware.js # Zod request validation
    rateLimiter.middleware.js
    upload.middleware.js   # Multer + CloudinaryStorage
    error.middleware.js    # Centralized error handler
  modules/
    auth/                  # login, register, refresh, logout
    user/                  # user CRUD, profile
    post/                  # posts (draft/published, slugs, TF-IDF fields)
    category/               # categories
    tag/                    # tags
    comment/                 # comments + threaded replies
    like/                    # post likes + comment likes
    view/                    # view history (per-user, per-post)
    trending/                # hot-score ranked feed
    recommendation/           # TF-IDF + cosine similarity engine
    corpusStats/               # single-document store for corpus-wide IDF
  services/
    vectorize.service.js     # corpus-wide + single-post TF-IDF vector computation
  cron/
    vectorRefresh.cron.js     # nightly corpus vector refresh
  helper/
    checkOwnership.js         # author/admin ownership checks
    cloudinaryDelete.js
  utils/
    AppError.js, errors.js     # custom error class hierarchy
    generateTokens.js, sendAuthCookies.js
    cloudinary.js
  seed/
    seedAdmin.js               # one-off script to create an admin user
```

## Module Anatomy

Every feature module follows the same shape:

```
route → middleware → controller → service → model
```

- **Route** — defines the endpoint and wires up middleware (auth, rate limiting, validation) in order.
- **Middleware** — cross-cutting concerns that run before the controller.
- **Controller** — thin; parses `req`, calls the service, shapes the response.
- **Service** — where business logic actually lives (DB queries, scoring, orchestration).
- **Model** — Mongoose schema.

Example — creating a post:

```
POST /api/v1/posts
  → createPostRateLimiter
  → isAuthenticated
  → validate(postSchema)
  → upload (Multer/Cloudinary)
  → post.controller.js
  → post.service.js
  → Post model → MongoDB
```

## Request Lifecycle

1. Request hits Express, passes through global middleware (`cors`, `cookie-parser`, `express.json`).
2. Route-specific middleware runs in order: rate limiter → auth → role check → validation → upload (if applicable).
3. Controller receives a clean, validated `req` and delegates to the service layer.
4. Service performs the actual logic and returns data (or throws an `AppError` subclass).
5. Any thrown error is caught by Express and handled by the centralized `errorHandler` in `app.js`.

## Recommendation & Trending Subsystems

These two modules are the most architecturally distinct part of the app — see `database.md` and `security.md` for schema/security details, but structurally:

- **`recommendation.tfidf.js`** — pure functions: tokenization, TF, IDF, cosine similarity. No DB access.
- **`vectorize.service.js`** — orchestrates TF-IDF computation against the DB: a full corpus refresh (nightly, via cron) and a cheap single-post update (on publish/edit, using the last cached IDF).
- **`recommendation.service.js`** — builds a per-user profile from view/like/comment history, scores candidate posts via cosine similarity, and falls back to the trending feed when there's no history, no candidates, or no meaningful score.
- **`trending.service.js`** — independent of TF-IDF; ranks posts published in the last 30 days by a time-decayed "hot score."

## App Bootstrapping (`index.js`)

1. Load environment variables (`dotenv`).
2. Connect to MongoDB (`connectDB`).
3. Start the nightly vector-refresh cron job.
4. Start the HTTP server.
5. Listen for `SIGINT` to shut down gracefully.
