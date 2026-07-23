# Database

**Database:** MongoDB, accessed via Mongoose. Nine collections, organized around a blog post's full lifecycle: authoring, categorization, engagement, and personalization.

## Collections

### `User`

| Field            | Type     | Notes                                      |
| ----------------- | -------- | -------------------------------------------- |
| `username`          | String   | unique, lowercase, trimmed                    |
| `email`               | String   | unique, lowercase, trimmed                     |
| `password`               | String   | hashed + peppered, `select: false`              |
| `role`                     | String   | enum `user`/`admin`, default `user`              |
| `avatar`, `avatarPublicId`  | String   | Cloudinary image + ID for deletion                |
| `bio`                         | String   | max 300 chars                                       |
| `refreshToken`                  | String   | `select: false` — not returned by default queries     |

### `Post`

| Field            | Type     | Notes                                      |
| ----------------- | -------- | -------------------------------------------- |
| `title`             | String   | 3–200 chars                                    |
| `content`             | String   | full body                                        |
| `slug`                  | String   | unique, URL-friendly                              |
| `coverImage`, `coverImagePublicId` | String | Cloudinary                                |
| `categories`, `tags`               | [ObjectId] | refs to `Category` / `Tag`               |
| `status`                             | String   | enum `draft`/`published`                    |
| `author`                               | ObjectId | ref `User`                                    |
| `viewsCount`                             | Number   | denormalized counter                            |
| `publishedAt`                              | Date     | set on publish; drives trending's time window     |
| `tfidfVector`                                | Map<String, Number> | `select: false` — TF-IDF weights per term |
| `vectorNorm`                                    | Number   | `select: false` — precomputed vector magnitude for fast cosine similarity |

**Indexes:**
- `{ title: "text", content: "text" }` — full-text search support.
- `{ author: 1, status: 1 }`, **unique + partial** (`status: "draft"` only) — enforces **one draft per author at a time**, an interesting business-rule-as-index-constraint.

**Virtuals** (not stored, computed via population):
- `commentsCount` — count of `Comment` docs referencing this post.
- `likesCount` — count of `PostLike` docs referencing this post.

### `Category` / `Tag`

Both are simple, near-identical schemas: `name` (unique) and `slug` (unique, lowercase). Kept as separate collections rather than a shared "taxonomy" collection, since categories and tags have distinct semantics (a post has one or few categories, but many tags).

### `Comment`

| Field            | Type     | Notes                                      |
| ----------------- | -------- | -------------------------------------------- |
| `user`, `post`      | ObjectId | refs                                            |
| `content`               | String   | max 1000 chars                                    |
| `parentComment`           | ObjectId | ref `Comment`, `null` for top-level — supports threaded replies |

**Indexes:** `{ post: 1 }`, `{ user: 1 }`, `{ parentComment: 1 }` — all queried frequently (comments-for-a-post, comments-by-a-user, replies-to-a-comment).

### `PostLike` / `CommentLike`

Two separate join collections rather than one polymorphic "Like" collection — keeps each one's unique constraint simple and its indexes lean:

- `PostLike`: `{ user, post }`, **unique** — a user can like a given post once.
- `CommentLike`: `{ user, comment }`, **unique** — same idea for comments.

### `ViewHistory`

| Field       | Type     | Notes                          |
| ------------ | -------- | --------------------------------- |
| `user`, `post` | ObjectId | refs                              |
| `viewedAt`       | Date     | defaults to now                     |

**Indexes:**
- `{ user: 1, post: 1 }`, **unique** — a view is recorded once per user/post pair (repeat visits update rather than duplicate).
- `{ user: 1, viewedAt: -1 }` — powers "get this user's most recently viewed posts," used directly by the recommendation engine.

### `CorpusStats`

A deliberately **single-document collection** — there is only ever one `CorpusStats` document in the whole database. It holds:

| Field            | Type     | Notes                                      |
| ----------------- | -------- | -------------------------------------------- |
| `idf`                | Map<String, Number> | corpus-wide inverse-document-frequency per term |
| `documentCount`         | Number   | number of published posts the IDF was computed over |

Refreshed wholesale by the nightly cron job (`refreshCorpusVectorsService`) — never computed live during a request, since IDF requires scanning every published post.

## Entity Relationships

```
User ──┬─< Post (author)
       ├─< Comment (user)
       ├─< PostLike (user)
       ├─< CommentLike (user)
       └─< ViewHistory (user)

Post ──┬─< Comment (post)
       ├─< PostLike (post)
       ├─< ViewHistory (post)
       ├─>< Category (many-to-many)
       └─>< Tag (many-to-many)

Comment ──< Comment (parentComment, self-referencing — threaded replies)
Comment ──< CommentLike (comment)

CorpusStats — standalone, one document, no relations (referenced by application logic, not by ObjectId ref)
```

## Design Notes Worth Mentioning in an Interview

- **Denormalized `viewsCount` on `Post`** alongside a normalized `ViewHistory` collection — the counter gives O(1) reads for display/trending, while the full history collection is what actually powers personalization (recency, per-user dedication). Two representations of "views," each serving a different need.
- **TF-IDF vectors stored directly on the `Post` document** (`select: false` so they don't bloat normal queries) rather than in a separate collection — keeps the read-heavy path (fetching a post) simple, while still letting the recommendation service `.select("tfidfVector vectorNorm")` only when it actually needs them.
- **Partial unique index for one-draft-per-author** — a good example of enforcing a business rule at the database layer instead of only in application code, so it holds even under concurrent requests.
