# Security

## Authentication

- **JWT-based**, with two tokens issued on login/register:
  - `accessToken` — short-lived, signed with `JWT_SECRET`.
  - `refreshToken` — longer-lived, signed with a **separate secret** (`REFRESH_TOKEN_SECRET`), and also stored on the user document so it can be invalidated server-side.
- Both tokens are sent as **httpOnly cookies** (`sendAuthCookies.js`), not exposed to JavaScript on the client:
  ```js
  { httpOnly: true, secure: NODE_ENV === "production", sameSite: "strict" }
  ```
  - `httpOnly` blocks access via `document.cookie`, mitigating XSS-based token theft.
  - `sameSite: "strict"` mitigates CSRF.
  - `secure` is enforced in production (cookies only sent over HTTPS).

## Refresh Flow

- `POST /api/v1/auth/refresh-token` verifies the refresh token's signature **and** checks it matches the token stored on the user document (`user.refreshToken !== refreshToken` → rejected). This means a stolen-but-since-rotated refresh token is rejected even if it's still validly signed.
- The `password` and `refreshToken` fields on the `User` model are `select: false` — never returned from a query unless explicitly requested with `.select("+refreshToken")`, reducing accidental leakage through normal user-fetch endpoints.

## Password Storage

- Passwords are hashed with **bcryptjs**, with a **pepper** appended before hashing:
  ```js
  const passwordWithPepper = password + process.env.PEPPER;
  bcryptjs.hash(passwordWithPepper, 10);
  ```
  The pepper is a server-side secret stored only in environment variables (never in the database), so even a full database compromise doesn't expose crackable hashes without also compromising the server's env config.

## Authorization

- **`isAuthenticated`** middleware — verifies the JWT from the `accessToken` cookie, loads the user, and attaches it to `req.user`. Throws `UnauthorizedError` for missing/invalid tokens.
- **`authorizeRoles(...roles)`** middleware — role-based access control (RBAC); restricts routes to specific roles (e.g. `admin`).
- **Ownership checks** (`helper/checkOwnership.js`) — two levels, chosen deliberately per action:
  - `checkOwnership` — **strict**, author-only, no admin override. Used for editing/publishing content, so even an admin can't silently rewrite someone else's post.
  - `checkOwnershipOrAdmin` — **relaxed**, author or admin. Used for deletion, where admin moderation should be possible.

## Input Validation

- Every mutating route validates its body against a **Zod schema** via the `validate` middleware before it reaches the controller. Invalid input is rejected with a `400` and the first validation error message/field — bad data never reaches business logic.

## Rate Limiting

Rate limits are **route-specific**, not global, sized to the sensitivity/abuse-potential of each action:

| Route type              | Window   | Max requests | Rationale                          |
| ------------------------ | -------- | ------------ | ----------------------------------- |
| Login                     | 2 min    | 10           | Brute-force protection              |
| Register                  | 2 min    | 10           | Bot/spam signup protection          |
| Refresh token              | 15 min   | 20           | Prevent token-refresh abuse         |
| Create post                 | 30 min   | 10           | Spam-post protection                |
| Update post                  | 1 hour   | 60           | Generous, but capped                |
| Delete post                   | 1 hour   | 20           | Prevent mass-deletion abuse          |
| Likes/interactions             | 1 min    | 30           | Prevent like-spam                    |
| Comments                        | 1 min    | 15           | Prevent comment flooding             |
| Uploads                          | 1 hour   | 20           | Cloudinary abuse/cost protection     |

## File Uploads

- Handled via Multer with `CloudinaryStorage`, restricted to `jpg`, `jpeg`, `png`, `webp`, with a **5MB file size limit** — rejects oversized or wrong-type files before they're ever stored.
- Images live on Cloudinary, not on the app server — the DB only stores the URL and `publicId` (used later for deletion via `cloudinaryDelete.js`).

## Error Responses

- Errors never leak stack traces or internals to the client — the centralized error handler returns only `statusCode` and `message` (see `error-handling.md`).

## Transport / CORS

- CORS is configured with a specific allowed origin and `credentials: true` (required for cookies to be sent cross-origin), rather than a wildcard `*` origin — prevents arbitrary sites from making authenticated requests on a user's behalf.

## Known Gaps / Possible Hardening

Worth being upfront about, if asked in an interview or code review:

- No `helmet` middleware currently — adding it would set safer default HTTP headers (`X-Content-Type-Options`, `X-Frame-Options`, etc.) with minimal effort.
- No explicit request body size limit on `express.json()` — worth adding to reduce large-payload DoS risk.
- No account lockout after repeated failed logins beyond the rate limiter window — the rate limiter mitigates but doesn't fully replace lockout/backoff strategies.
