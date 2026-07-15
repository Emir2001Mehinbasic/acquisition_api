# acquisition_api

Express.js API with authentication, JWT cookies, Drizzle ORM, Neon, and Arcjet.

## Environment split

- `DATABASE_URL` points to Neon Local in development.
- `DATABASE_URL` points to Neon Cloud in production.
- `src/config/database.js` enables Neon Local HTTP settings only when `NEON_LOCAL=true` or `DATABASE_FETCH_ENDPOINT` is set.

## Development with Neon Local

1. Fill in `.env.development` with your Neon API key, project ID, and parent branch ID.
2. Start the stack:

```bash
docker compose -f docker-compose.dev.yml up --build
```

3. The app runs on `http://localhost:8080`.
4. The database connection used by the app is:

```text
postgres://neon:npg@neon-local:5432/acquisition_api?sslmode=require
```

Neon Local creates an ephemeral branch from `PARENT_BRANCH_ID` when the container starts and deletes it when the container stops. That gives you a fresh dev/test database each time.

## Production with Neon Cloud

1. Fill in `.env.production` with your real Neon Cloud `DATABASE_URL` and secrets.
2. Start the production container:

```bash
docker compose -f docker-compose.prod.yml up --build
```

3. The app connects directly to Neon Cloud using the injected `DATABASE_URL`.
4. No Neon Local proxy runs in production.

## Notes

- `docker-compose.dev.yml` runs both the app and Neon Local.
- `docker-compose.prod.yml` runs only the app because Neon Cloud is an external managed database, not a container you run locally.
- The app uses the Neon serverless driver, so Neon Local also sets `DATABASE_FETCH_ENDPOINT=http://neon-local:5432/sql` in development.
