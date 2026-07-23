# Error Handling

## Philosophy

Errors are handled with a **custom error class hierarchy** rather than throwing raw `Error` objects or handling status codes inline in every controller. This keeps error responses consistent across the entire API regardless of which layer or module raised the error.

## The `AppError` Base Class

```js
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
```

- `statusCode` — the HTTP status to respond with.
- `status` — `"fail"` for 4xx (client errors) vs `"error"` for 5xx (server errors) — useful for logging/monitoring dashboards that want to separate the two.
- `isOperational` — marks this as a *known, expected* error (as opposed to a bug/unexpected exception) — the kind of flag that would let a more advanced setup decide whether to crash-and-restart the process vs. just respond and continue.

## Specific Error Types

Rather than instantiating `AppError` directly everywhere, the codebase defines named subclasses per HTTP status, each with a sensible default message:

| Class                     | Status | Used for                                      |
| -------------------------- | ------ | ---------------------------------------------- |
| `BadRequestError`            | 400    | Malformed requests                              |
| `UnauthorizedError`            | 401    | Missing/invalid JWT, bad login credentials       |
| `ForbiddenError`                 | 403    | Authenticated but not permitted (ownership/RBAC) |
| `NotFoundError`                    | 404    | Resource doesn't exist                           |
| `ConflictError`                      | 409    | Duplicate resource (e.g. unique constraint)       |
| `ValidationError`                      | 422    | Semantic validation failure                        |
| `TooManyRequestsError`                   | 429    | Rate limit exceeded                                 |
| `InternalServerError`                       | 500    | Unexpected server error                              |
| `ServiceUnavailableError`                       | 503    | Downstream dependency unavailable                     |

This means service-layer code reads declaratively:

```js
if (!user) throw new NotFoundError("User not found");
if (!isPasswordMatch) throw new UnauthorizedError("Invalid username or password");
```

instead of manually setting status codes at every throw site.

## Centralized Error Middleware

```js
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
};
```

Registered as the **last** middleware in `app.js`, after all routes. Any error thrown (or passed to `next(err)`) anywhere in the request lifecycle — middleware, controller, or service — bubbles up here automatically, since Express routes synchronous throws and rejected promises (in Express 5, async route handlers are auto-wrapped) to the error-handling middleware.

Consequences of this design:

- Every error response has the **same shape** — `{ success, statusCode, message }` — so the frontend can handle errors generically instead of branching per-endpoint.
- Unknown/unexpected errors (e.g. a bug that throws a plain `Error`, or a Mongoose cast error) fall through to the `500` default rather than leaking a stack trace to the client.
- Business logic never has to `try/catch` and format a response manually — it just throws the appropriate `AppError` subclass and moves on.

## Validation Errors (a slightly different path)

Zod validation failures are handled separately, directly inside the `validate` middleware, **before** a request ever reaches a controller:

```js
if (!result.success) {
  const firstError = result.error.issues[0];
  return res.status(400).json({ message: firstError.message, field: firstError.path[0] });
}
```

This short-circuits early with the **first** validation error and which field it came from, rather than dumping the entire Zod error tree on the client.

## Example: Full Error Flow

A login request with the wrong password:

1. `auth.route.js` → `loginRateLimiter` passes (under the limit).
2. `validate(loginUserSchema)` passes (fields are well-formed).
3. `auth.controller.js` calls `loginUserService`.
4. `auth.service.js` compares the hashed password, finds a mismatch, and `throw new UnauthorizedError("Invalid username or password")`.
5. Express catches the thrown error and forwards it to `errorHandler`.
6. Client receives:
   ```json
   { "success": false, "statusCode": 401, "message": "Invalid username or password" }
   ```

## Cron Job Error Handling

The nightly vector-refresh cron job (`vectorRefresh.cron.js`) wraps its work in its own `try/catch`, since it runs outside the request/response cycle and has no `errorHandler` to fall back to — failures are logged to the console rather than crashing the process, so a single failed refresh doesn't take down the server.
