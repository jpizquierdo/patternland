# PatternLand

PatternLand is a self-hosted sewing pattern manager. Upload your paper and digital patterns, attach PDF files in multiple formats (A0, A4, projector-ready, with/without seam allowance), browse and filter your collection, and download any file at any time — all from a clean web interface.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript, Vite, TanStack Router & Query, Chakra UI v3 |
| Backend | FastAPI, SQLModel, Alembic, Pydantic, argon2-cffi (JWT auth) |
| Database | PostgreSQL 17 |
| Object storage | MinIO (S3-compatible) |
| Proxy | Traefik |
| Package managers | uv (Python), npm (Node) |

## Prerequisites

- [Docker](https://docs.docker.com/engine/install/) + Docker Compose v2
- `python -c "import secrets; print(secrets.token_urlsafe(32))"` available for secret generation

## Quick Start

1. **Copy the example env file and fill in your secrets:**

```bash
cp my.env.example .env
```

Generate strong values for every field that says `changethis`:

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

2. **Start the stack:**

```bash
docker compose watch
```

3. **Open the app:**

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| Interactive API docs | http://localhost:8000/docs |
| Adminer (DB UI) | http://localhost:8080 |
| MinIO console | http://localhost:9001 |
| Traefik dashboard | http://localhost:8090 |
| MailCatcher | http://localhost:1080 |

Log in with the `FIRST_SUPERUSER` / `FIRST_SUPERUSER_PASSWORD` values from your `.env`.

> The first startup may take a minute while the backend waits for the database and runs migrations.

## Configuration

All runtime configuration lives in a single `.env` file at the project root. Copy `my.env.example` to `.env` and set each value.

Key variables:

| Variable | Description |
|---|---|
| `SECRET_KEY` | JWT signing key — generate with `secrets.token_urlsafe(32)` |
| `FIRST_SUPERUSER` | Email of the initial admin user |
| `FIRST_SUPERUSER_PASSWORD` | Password of the initial admin user |
| `POSTGRES_PASSWORD` | PostgreSQL password |
| `MINIO_ROOT_USER` / `MINIO_ROOT_PASSWORD` | MinIO admin credentials |
| `S3_ACCESS_KEY` / `S3_SECRET_KEY` | MinIO bucket access credentials |
| `DOMAIN` | Base domain (`localhost` for local dev) |
| `ENVIRONMENT` | `local`, `staging`, or `production` |

See `my.env.example` for the full list.

## Development

For running individual services locally (outside Docker) or working with pre-commit hooks, see **[development.md](./development.md)**.

## Deployment

For production deployment with Traefik, TLS certificates, and GitHub Actions CI/CD, see **[deployment.md](./deployment.md)**.

## Project Structure

```
patternland/
├── backend/          # FastAPI application (Python, uv)
│   ├── app/
│   │   ├── api/      # Route handlers
│   │   ├── models/   # SQLModel database models
│   │   └── tests/    # Pytest test suite
│   └── pyproject.toml
├── frontend/         # React application (TypeScript, npm)
│   ├── src/
│   │   ├── client/   # Auto-generated OpenAPI client
│   │   ├── components/
│   │   └── routes/   # TanStack file-based routes
│   └── package.json
├── docker-compose.yaml
├── docker-compose.override.yaml   # Local dev overrides
├── my.env.example
└── .env                           # Your local config (not committed)
```

## Release Notes

See [release-notes.md](./release-notes.md).

## Security

See [SECURITY.md](./SECURITY.md) for the vulnerability reporting policy.

## Acknowledgments

- **[Full Stack FastAPI Template](https://github.com/fastapi/full-stack-fastapi-template)** — inspired the initial project structure and was a key learning resource.
- **[FastAPI](https://fastapi.tiangolo.com/)** — high-performance Python web framework.
- **[SQLModel](https://sqlmodel.tiangolo.com/)** — combines SQLAlchemy and Pydantic for clean database models.

Thanks to all contributors of these open-source projects and every library used in this project!

## License

This project is licensed under the terms of the [MIT License](LICENSE).
