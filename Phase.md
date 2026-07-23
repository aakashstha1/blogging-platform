# Development Phases

A logical build-order for the backend, based on how each module depends on the ones before it. Useful as a roadmap reference or for explaining the project's progression in an interview.

## Phase 1 — Foundation

- Express app setup (`app.js`, `index.js`), MongoDB connection (`config/db-config.js`).
- Centralized error handling: `AppError` base class + typed subclasses (`BadRequestError`, `NotFoundError`, etc.) and the global `errorHandler` middleware.
- Environment configuration (`dotenv`, `.env.example`).

## Phase 2 — Auth & Users

- `User` model: credentials, role, profile fields.
- Registration/login with bcrypt + pepper password hashing.
- JWT access + refresh token issuance, delivered via httpOnly cookies.
- `isAuthenticated` and `authorizeRoles` middleware.
- Zod validation middleware, applied to auth routes first.
- Admin seed script (`seedAdmin.js`).

## Phase 3 — Content Core

- `Category` and `Tag` models — simple taxonomy needed before posts can reference them.
- `Post` model: draft/published lifecycle, slugs, Cloudinary cover images.
- Post CRUD with ownership checks (`checkOwnership` — author-only for edit/publish).
- Multer + `CloudinaryStorage` upload middleware.
- Full-text index on `title`/`content`; partial unique index enforcing one draft per author.

## Phase 4 — Engagement

- `Comment` model with self-referencing `parentComment` for threaded replies.
- `PostLike` / `CommentLike` models with unique constraints (one like per user per target).
- `ViewHistory` model, recording per-user/per-post views with a `viewedAt` timestamp.
- Route-specific rate limiters introduced here (`interactionRateLimiter`, `commentRateLimiter`) as engagement endpoints became abuse-prone.
- `checkOwnershipOrAdmin` introduced for deletion, allowing admin moderation of others' content.

## Phase 5 — Discovery: Trending

- `trending.service.js`: time-decayed "hot score" combining views, likes, and comments over a 30-day candidate window.
- Depends on Phase 4's like/comment/view data being in place to compute engagement scores.

## Phase 6 — Personalization: Recommendation Engine

The most involved phase, built in sub-steps:

1. **`recommendation.tfidf.js`** — pure tokenization, TF, IDF, and cosine similarity functions, built and tested independently of the database.
2. **`CorpusStats` model + `vectorize.service.js`** — corpus-wide IDF computation and per-post vector storage (`tfidfVector`, `vectorNorm` added to `Post`).
3. **`vectorRefresh.cron.js`** — scheduled nightly job to keep corpus vectors fresh without paying that cost on every request.
4. **Single-post incremental update** — added after the full-refresh cron, to avoid new/edited posts sitting with no vector until the next nightly run.
5. **`recommendation.service.js`** — ties it together: builds a weighted user profile from recent views/likes/comments, scores candidates by cosine similarity, and falls back to the trending feed when there's no history, no candidates, or no meaningful score.

## Phase 7 — Hardening

- Rate limiters extended across all remaining sensitive routes (post create/update/delete, uploads).
- Ownership/authorization rules audited and split into the strict (`checkOwnership`) vs. relaxed (`checkOwnershipOrAdmin`) helpers used today.
- Error handling reviewed for consistency across all modules (every thrown error using a typed `AppError` subclass rather than generic `Error`).

## Possible Future Phases

- Add `helmet` and stricter body-size limits (see `security.md` → Known Gaps).
- Move TF-IDF/cosine similarity out of application memory into a dedicated vector index if corpus size grows significantly.
- Add automated tests (currently no test suite is configured — `npm test` is a placeholder).
- Add refresh-token rotation (issue a new refresh token on each use, invalidating the old one) for stronger session security.
