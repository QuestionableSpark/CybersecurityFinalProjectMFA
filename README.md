# MFA Portal

A minimal React/TypeScript + FastAPI scaffold for a cybersecurity course project. The public homepage and login form are present; **authentication does not work yet**. Neither password verification nor the second factor has been implemented.

## Local development

Install [Bun](https://bun.sh/) and [uv](https://docs.astral.sh/uv/), then from the repository root:

```sh
bun install --cwd client
uv sync
bun run dev  # or: uv run dev
```

Open http://127.0.0.1:5173/. Both commands start Vite and the FastAPI server (127.0.0.1:8000); Vite proxies `/api` to FastAPI. Stop with Ctrl-C. To check the frontend build, run `bun run build`.

## Layout

- `client/`: React login form and public homepage.
- `api/`: FastAPI login endpoints, SQLite schema, and authentication stubs.
- `data/auth.db`: local SQLite database, created at API startup and ignored by Git. Set `MFA_DB_PATH` to change its location.

The `users` table has a `password_hash` field intended for a salted, self-describing password hash (such as Argon2's PHC encoding). No accounts or plaintext passwords are created. `POST /api/auth/login` and `POST /api/auth/verify-otp` currently return HTTP 501; the form reports that credentials were not checked. Do not treat this prototype as an access-control boundary. The second-factor scheme, challenge state, sessions, and the course analysis report remain to be implemented as part of the project.
