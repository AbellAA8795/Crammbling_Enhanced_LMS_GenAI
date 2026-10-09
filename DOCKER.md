# Running Crammbling with Docker

With Docker you don't need to install Node.js, PostgreSQL or Redis yourself. One command starts the whole system, and code changes you make reload automatically.

## What you need

- [Docker Desktop](https://www.docker.com/products/docker-desktop/), installed and **running**
- Git

That's all. Don't run `npm install` on your own machine; the containers have their own dependencies.

## First-time setup

1. Clone the repo and open a terminal in the project root (the folder that contains `docker-compose.yml`).
2. Create your env file:

   ```bash
   cp .env.example .env
   ```

3. Open `.env` and fill in the two required values. The comments show a command to generate each one. Ask the team lead for the Google and email credentials if you need to work on login, OTP or Google Calendar.
4. Start everything:

   ```bash
   docker compose up --build
   ```

   The first run takes a few minutes. You're ready when you see `Server running on port 5000` and Vite's `Local: http://localhost:5173/`.

| What | Where |
|---|---|
| Web app | http://localhost:5173 |
| API | http://localhost:5000 |
| PostgreSQL (for pgAdmin) | host `localhost`, port `5433`, user `postgres`, password from `DB_PASSWORD` in `.env` (default `postgres`), database `Crammbling_DB` |
| Redis | `localhost:6380` |

The database ports are 5433 and 6380 (not the usual 5432 and 6379), so they don't clash with a PostgreSQL or Redis you may already have installed.

## Daily use

| Task | Command |
|---|---|
| Start (in the background) | `docker compose up -d` |
| See logs | `docker compose logs -f server` (or `client`, `db`) |
| Stop | `docker compose down` |
| Restart one service | `docker compose restart server` |
| Open a SQL shell | `docker compose exec db psql -U postgres -d Crammbling_DB` |

**Editing code:** edit files in `server/` or `client/my-react-app/` as usual. The server restarts and the browser hot-reloads automatically.

**Adding an npm package:** run it inside the container, so `package.json` and `package-lock.json` update for everyone:

```bash
docker compose exec server npm install <package>
docker compose exec client npm install <package>
```

When someone else adds a package, rebuild after you pull:

```bash
docker compose up --build -V
```

(`-V` throws away the old `node_modules` volume so the new packages are installed.)

## The AI chatbot (Ollama)

The chatbot needs an Ollama model, which is a few GB, so it's optional.

- **Run Ollama in Docker:** `docker compose --profile ai up --build`. The first run downloads `llama3.2`. Without a GPU, replies are slow.
- **Already have Ollama installed on your machine?** Set `OLLAMA_URL=http://host.docker.internal:11434` in `.env` and start normally.

Without either, everything else works; only chat requests fail.

## The database

The first time the `db` container starts, it builds `Crammbling_DB` from:

- `docker/db/init/01_schema.sql`: every schema, table, type, index, procedure, function and trigger
- `docker/db/init/02_seed.sql`: the chatbot system prompts

These scripts run **only when the database volume is empty**. Your data is kept between restarts.

**Reset your database to a clean copy** (this deletes all your local data):

```bash
docker compose down -v
docker compose up -d
```

### Changing the database schema

The init scripts are the team's shared source of truth for the database. When you add or change a table, procedure, function or trigger:

1. Make the change in your own container (pgAdmin on port 5433, or `docker compose exec db psql ...`).
2. Re-export the schema so teammates get it:

   ```bash
   docker compose exec db pg_dump -U postgres -d Crammbling_DB --schema-only --no-owner --no-privileges > docker/db/init/01_schema.sql
   ```

3. Commit `01_schema.sql` with your code change. Teammates apply it by resetting their database (above).

## Troubleshooting

| Problem | Fix |
|---|---|
| `failed to connect to the docker API` | Docker Desktop isn't running. Start it and wait until it says "Engine running". |
| `Set JWT_SECRET in .env` | You haven't created `.env` or left a required value empty. |
| `port is already allocated` | Something else uses that port. Change `DB_HOST_PORT` / `REDIS_HOST_PORT` in `.env`, or stop the other program (for example, a local `npm run dev` on 5000 or 5173). |
| Server keeps restarting | `docker compose logs server` shows the error. |
| New package "not found" after a pull | `docker compose up --build -V` |
| Schema changes don't show up | Init scripts only run on an empty volume: `docker compose down -v` then `up`. |
