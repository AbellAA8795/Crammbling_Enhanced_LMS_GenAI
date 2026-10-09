# Crammbling: Developing with Docker

This guide gets the whole Crammbling system running on your computer with Docker, then walks you through the everyday work of changing code, adding packages and changing the database.

You do **not** need to install Node.js, PostgreSQL, Redis or Ollama. Docker runs all of them for you, in the same versions for everyone on the team.

---

## Contents

1. [How it works](#1-how-it-works)
2. [Install Docker (one time)](#2-install-docker-one-time)
3. [Set up the project (one time)](#3-set-up-the-project-one-time)
4. [Start the system for the first time](#4-start-the-system-for-the-first-time)
5. [Check that everything works](#5-check-that-everything-works)
6. [Everyday workflow](#6-everyday-workflow)
7. [Adding or updating npm packages](#7-adding-or-updating-npm-packages)
8. [Working with the database](#8-working-with-the-database)
9. [The AI chatbot (Ollama)](#9-the-ai-chatbot-ollama)
10. [Google login, Google Calendar and email](#10-google-login-google-calendar-and-email)
11. [Testing the API](#11-testing-the-api)
12. [Troubleshooting](#12-troubleshooting)
13. [Command cheat sheet](#13-command-cheat-sheet)

---

## 1. How it works

`docker-compose.yml` in the project root starts these **containers** (small, isolated Linux machines):

| Container | What it runs | Address on your computer |
|---|---|---|
| `client` | React app (Vite dev server) | http://localhost:5173 |
| `server` | Express API (Node 22) | http://localhost:5000 |
| `db` | PostgreSQL 18 with `Crammbling_DB` | `localhost:5433` |
| `redis` | Redis 7 (cache) | `localhost:6380` |
| `ollama` | AI model server (optional) | http://localhost:11434 |

Things to know:

- **Your code stays on your computer.** The `server/` and `client/my-react-app/` folders are shared into the containers. Edit files in VS Code as usual; the server restarts and the browser reloads on its own.
- **Dependencies live inside the containers.** Each container has its own `node_modules`. Don't run `npm install` on your computer (see [section 7](#7-adding-or-updating-npm-packages)).
- **Your database is your own.** Each developer gets a private copy of `Crammbling_DB`, created from the scripts in `docker/db/init/`. Nothing you do in it affects anyone else.
- **Data survives restarts.** Stopping and starting the containers keeps your database. Only `docker compose down -v` erases it.
- **Ports 5433 and 6380** are used for the database and Redis (instead of the usual 5432 and 6379) so they don't clash with a PostgreSQL or Redis you may already have installed.

---

## 2. Install Docker (one time)

### Windows 10/11

1. Download **Docker Desktop for Windows** from https://www.docker.com/products/docker-desktop/.
2. Run the installer. Leave **"Use WSL 2 instead of Hyper-V"** ticked.
3. Restart your computer if asked.
4. Open Docker Desktop and accept the terms. Wait until the bottom-left corner shows **"Engine running"** (green).
5. If Docker asks you to install or update WSL, open **PowerShell as Administrator** and run:

   ```powershell
   wsl --install
   ```

   Then restart and open Docker Desktop again.

### macOS

1. Download **Docker Desktop for Mac** from https://www.docker.com/products/docker-desktop/. Choose **Apple Silicon** (M1/M2/M3/M4) or **Intel**, depending on your Mac ( > About This Mac).
2. Drag Docker into Applications and open it.
3. Wait until it shows **"Engine running"**.

### Linux

Install Docker Engine and the Compose plugin by following https://docs.docker.com/engine/install/ for your distribution, then let your user run Docker without `sudo`:

```bash
sudo usermod -aG docker $USER
```

Log out and back in.

### Check the installation

Open a terminal (PowerShell, Terminal, or the VS Code terminal) and run:

```bash
docker --version
docker compose version
```

Both should print a version number. If you see `failed to connect to the docker API`, Docker Desktop isn't running yet. Start it and wait for "Engine running".

**Recommended (Windows):** in Docker Desktop, go to **Settings > Resources** and give Docker at least **4 GB of memory** (8 GB if you'll run the AI chatbot).

---

## 3. Set up the project (one time)

### 3.1 Get the code

```bash
git clone <repository-url>
cd Crammbling_Web_App
git checkout <the branch you're working on>
```

All commands in this guide are run from this **project root** folder, the one that contains `docker-compose.yml`.

### 3.2 Create your `.env` file

The `.env` file holds secrets and settings. It is git-ignored, so each developer has their own and it's never committed.

Copy the template:

```bash
# Windows PowerShell
Copy-Item .env.example .env

# macOS / Linux / Git Bash
cp .env.example .env
```

Open `.env` in VS Code.

### 3.3 Fill in the two required secrets

The system won't start without `JWT_SECRET` and `TOKEN_ENCRYPTION_KEY`. Generate them with Docker (no Node.js needed):

```bash
docker run --rm node:22-alpine node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Copy the output into `.env` after `JWT_SECRET=`.

```bash
docker run --rm node:22-alpine node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy the output into `.env` after `TOKEN_ENCRYPTION_KEY=`.

Your `.env` should now look like this (with your own values):

```env
JWT_SECRET=3f9a1c...long hex string...
TOKEN_ENCRYPTION_KEY=q8m2Zx...ends with =
```

Rules:
- No spaces around `=`, and no quotes.
- `TOKEN_ENCRYPTION_KEY` must be generated with the command above (32 random bytes in base64). Any other value makes the server stop with `TOKEN_ENCRYPTION_KEY must decode to exactly 32 bytes`.

### 3.4 Optional settings

Leave the rest as they are for now. You only need them for specific features:

| Setting | Needed for | Where to get it |
|---|---|---|
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google login, Google Calendar | Ask the team lead (see [section 10](#10-google-login-google-calendar-and-email)) |
| `EMAIL_USER`, `EMAIL_PASS` | Registration OTP emails | Your own Gmail + App Password (see [section 10](#10-google-login-google-calendar-and-email)) |
| `OLLAMA_URL`, `OLLAMA_MODEL` | AI chatbot | See [section 9](#9-the-ai-chatbot-ollama) |
| `DB_HOST_PORT`, `REDIS_HOST_PORT` | Only if ports 5433 / 6380 are already taken on your computer | Pick any free port |

You don't need `server/.env` or `client/my-react-app/.env` when using Docker; the containers get all their settings from the root `.env` and `docker-compose.yml`.

---

## 4. Start the system for the first time

Make sure Docker Desktop shows "Engine running", then:

```bash
docker compose up --build
```

What happens:

1. Docker downloads PostgreSQL, Redis and Node images (a few hundred MB, first time only).
2. It builds the `server` and `client` images and runs `npm ci` inside them.
3. PostgreSQL creates `Crammbling_DB` and runs `docker/db/init/01_schema.sql` and `02_seed.sql`.
4. The server and client start.

The first run takes **3 to 10 minutes** depending on your internet. Later starts take seconds.

You're ready when the log shows both of these lines:

```
server-1  | Server running on port 5000
server-1  | Redis connected (redis://redis:6379)
client-1  |   ➜  Local:   http://localhost:5173/
```

This terminal now shows live logs from every container. Leave it open, or press `Ctrl+C` to stop everything.

**Tip:** to run in the background instead, use `docker compose up -d --build`, and view logs with `docker compose logs -f`.

---

## 5. Check that everything works

Go through this checklist once after your first start:

| Check | How | Expected |
|---|---|---|
| All containers are up | `docker compose ps` | `client` Up; `server`, `db`, `redis` Up **(healthy)** |
| API responds | Open http://localhost:5000 | `Crammbling backend is running!` |
| API can reach the database and Redis | Open http://localhost:5000/api/health | `{"status":"ok","db":"up","redis":"up"}` |
| The API tests pass | `docker compose exec server npm test` | `fail 0` at the end (see [section 11](#11-testing-the-api)) |
| Web app loads | Open http://localhost:5173 | The Crammbling login page |
| Database was created | `docker compose exec db psql -U postgres -d Crammbling_DB -c "\dn"` | Schemas `auth`, `chatbot`, `social`, `notification`, `personalization`, `audit` |
| Live reload works | Save any file in `server/src/` | Server log shows `restarting due to changes...` |

Your database starts with four **test accounts** (from `docker/db/init/03_test_accounts.sql`), so you can log in right away without setting up email. They all use the password `Password123!`:

| Email | Username | Role |
|---|---|---|
| `student1@crammbling.test` | `test_student1` | student |
| `student2@crammbling.test` | `test_student2` | student |
| `teacher@crammbling.test` | `test_teacher` | teacher |
| `admin@crammbling.test` | `test_admin` | super_admin |

They exist only in your local Docker database. You can still register your own account too; if you haven't set up email, see [section 10](#email-for-registration-otp) for how to verify it without email.

---

## 6. Everyday workflow

### Starting and stopping

```bash
docker compose up -d        # start (in the background)
docker compose ps           # see what's running
docker compose logs -f server   # follow the server's logs (Ctrl+C to stop following)
docker compose down         # stop everything (your data is kept)
```

You can close Docker Desktop at the end of the day. Next time, open it, wait for "Engine running", and run `docker compose up -d`.

### Changing code

Just edit and save:

- **Backend** (`server/`): the server restarts automatically within a few seconds. Watch `docker compose logs -f server` for errors.
- **Frontend** (`client/my-react-app/`): the browser reloads automatically.

If a change doesn't seem to apply, restart that one container:

```bash
docker compose restart server
docker compose restart client
```

### After pulling teammates' changes

```bash
git pull
docker compose up -d --build -V
```

- `--build` rebuilds the images in case a `Dockerfile` or `package.json` changed.
- `-V` gives the containers fresh `node_modules`, so newly added packages are installed.

If the pull changed `docker/db/init/01_schema.sql`, you also need to reset your database (see [section 8.4](#84-getting-teammates-database-changes)).

### Running commands inside a container

```bash
docker compose exec server sh     # open a shell in the server container (type exit to leave)
docker compose exec server node some-script.js
docker compose exec client npm run lint
```

---

## 7. Adding or updating npm packages

**Always install packages through the container**, never with `npm install` on your computer. Your computer's `node_modules` (Windows or macOS) is incompatible with the containers (Linux), and installing inside the container keeps `package.json` and `package-lock.json` correct for everyone.

```bash
# Backend package
docker compose exec server npm install <package-name>

# Frontend package
docker compose exec client npm install <package-name>

# Dev-only frontend package
docker compose exec client npm install -D <package-name>
```

`package.json` and `package-lock.json` update in your project folder. **Commit both files.** Teammates pick up the package with `docker compose up -d --build -V` after pulling.

To remove a package: `docker compose exec server npm uninstall <package-name>`.

---

## 8. Working with the database

### 8.1 Connecting with pgAdmin

1. In pgAdmin, right-click **Servers > Register > Server...**
2. **General** tab: Name `Crammbling (Docker)`.
3. **Connection** tab:

   | Field | Value |
   |---|---|
   | Host name/address | `localhost` |
   | Port | `5433` (or your `DB_HOST_PORT`) |
   | Maintenance database | `Crammbling_DB` |
   | Username | `postgres` |
   | Password | your `DB_PASSWORD` from `.env` (default `postgres`) |

4. Click **Save**.

The containers must be running for pgAdmin to connect.

**Without pgAdmin**, there's a database viewer that runs in your browser (Adminer). Start it with:

```bash
docker compose --profile tools up -d adminer
```

Open http://localhost:8080 and log in with **System** `PostgreSQL`, **Server** `db`, **Username** `postgres`, **Password** your `DB_PASSWORD` (default `postgres`), **Database** `Crammbling_DB`. Stop it with `docker compose stop adminer`.

Or use the SQL shell in the container:

```bash
docker compose exec db psql -U postgres -d Crammbling_DB
```

Useful `psql` commands: `\dn` (schemas), `\dt auth.*` (tables in a schema), `\df personalization.*` (procedures and functions), `\q` (quit).

### 8.2 How the database is created

When the `db` container starts with an **empty** data volume, PostgreSQL runs the scripts in `docker/db/init/` in order:

| File | Contains |
|---|---|
| `01_schema.sql` | Every schema, type, table, index, constraint, procedure, function and trigger |
| `02_seed.sql` | Starting data: the chatbot system prompts |
| `03_test_accounts.sql` | Four fake test accounts for local development (see [section 5](#5-check-that-everything-works)) |

These scripts run **only once**, the first time. After that, your data volume exists and they're skipped, which is why your data survives restarts.

### 8.3 Changing the database (tables, procedures, functions, triggers)

`docker/db/init/01_schema.sql` is the team's **shared source of truth**. When you change the database, you must update this file, or your teammates won't get your change.

1. **Make the change in your own database.** Use pgAdmin's Query Tool, or `docker compose exec db psql -U postgres -d Crammbling_DB`. Test it with your backend code.

2. **Export the updated schema** from the project root:

   ```bash
   # macOS / Linux / Git Bash
   docker compose exec -T db pg_dump -U postgres -d Crammbling_DB --schema-only --no-owner --no-privileges > docker/db/init/01_schema.sql
   ```

   ```powershell
   # Windows PowerShell (keeps the file in UTF-8)
   docker compose exec -T db pg_dump -U postgres -d Crammbling_DB --schema-only --no-owner --no-privileges | Out-File -Encoding utf8NoBOM docker/db/init/01_schema.sql
   ```

   If `utf8NoBOM` gives an error (older Windows PowerShell 5.1), run the command from **Git Bash** instead.

3. **Check the diff** in VS Code's Source Control panel. You should see only your change (plus a changed random `\restrict` line at the top and bottom, which is normal).

4. **If you changed starting data** (for example, added a system prompt), update `02_seed.sql` as well:

   ```bash
   docker compose exec -T db pg_dump -U postgres -d Crammbling_DB --data-only --no-owner --inserts --table=chatbot.system_prompts > docker/db/init/02_seed.sql
   ```

   Never export user data (users, chats, friendships) into the seed file.

5. **Commit** the `.sql` files together with the backend code that uses them, and mention in your commit or pull request that teammates need to reset their database.

**Team rule:** to avoid two people overwriting each other's schema changes, pull the latest code and reset your database (8.4) **before** you start a database change, and tell the team in the group chat when you push one.

### 8.4 Getting teammates' database changes

When a pull changes `docker/db/init/`, rebuild your database from the new scripts:

```bash
docker compose down -v
docker compose up -d
```

**`-v` deletes your local database data** (your test users, chats, events). The new database is created from the updated scripts. You'll need to register a test account again.

### 8.5 Resetting your database

The same two commands give you a clean database at any time, for example after messy testing:

```bash
docker compose down -v
docker compose up -d
```

To reset **only** the database and keep Ollama's downloaded model:

```bash
docker compose stop db
docker compose rm -f db
docker volume rm crammbling_web_app_db-data
docker compose up -d db
```

(Run `docker volume ls` to check the exact volume name; it starts with your project folder's name.)

---

## 9. The AI chatbot (Ollama)

The chatbot needs an Ollama AI model. It's optional because the model is about 2 GB and needs plenty of memory. **Everything else works without it**; only chat requests fail.

Pick **one** option:

### Option A: Run Ollama in Docker

```bash
docker compose --profile ai up -d --build
```

The first time, the `ollama-pull` container downloads the `llama3.2` model (about 2 GB). Check progress with:

```bash
docker compose logs -f ollama-pull
```

When it finishes, the chatbot works. Keep using `--profile ai` every time you start, or set it once in `.env` so you don't have to type it:

```env
COMPOSE_PROFILES=ai
```

Without a GPU, replies can take 10 to 60 seconds. That's normal.

### Option B: Use Ollama installed on your computer

If you already have Ollama installed (https://ollama.com) and the model pulled (`ollama pull llama3.2`), set this in `.env`:

```env
OLLAMA_URL=http://host.docker.internal:11434
```

Then restart the server: `docker compose up -d server`.

---

## 10. Google login, Google Calendar and email

### Google login and Google Calendar

These are **optional**. Without them the server still starts and everything else works; only "Sign in with Google" and Google Calendar sync are off (the `/api/auth/google` routes answer `503`, and the server log says `Google sign-in disabled`).

1. Ask the team lead for the development `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`, and put them in `.env`. **Never commit them or post them in public channels.**
2. Restart the server: `docker compose up -d server`.

These callback URLs must be registered in the Google Cloud Console project (the team lead has already done this; they're the same for everyone because the API always runs on `localhost:5000`):

- `http://localhost:5000/api/auth/google/callback`
- `http://localhost:5000/api/personalization/google-calendar/callback`

For Google Calendar, your Google account may also need to be added as a **test user** in the Google Cloud Console. Ask the team lead if you see "Access blocked: this app has not completed verification".

### Email for registration OTP

Registration sends a one-time code by email. To make it work, use your own Gmail account:

1. Turn on 2-Step Verification for your Google account.
2. Create an **App Password** at https://myaccount.google.com/apppasswords.
3. In `.env`:

   ```env
   EMAIL_USER=your.address@gmail.com
   EMAIL_PASS=the 16-character app password, without spaces
   ```

4. Restart the server: `docker compose up -d server`.

**Without email set up**, you can still create a test account. Register in the app, then read the code straight from your database:

```bash
docker compose exec db psql -U postgres -d Crammbling_DB -c "SELECT email, otp_code, expires_at FROM auth.otp_codes ORDER BY expires_at DESC LIMIT 1;"
```

Or skip the code and mark the account verified:

```bash
docker compose exec db psql -U postgres -d Crammbling_DB -c "UPDATE auth.users SET is_verified = true WHERE email = 'you@example.com';"
```

(This is only for your local test database. Application code must always go through the stored procedures.)

### Making a test account a teacher or admin

```bash
docker compose exec db psql -U postgres -d Crammbling_DB -c "UPDATE auth.users SET role = 'teacher' WHERE email = 'you@example.com';"
```

Use `'super_admin'` for an admin. Log out and back in so your new token includes the role.

---

## 11. Testing the API

### 11.1 Automated API tests

`server/tests/api.test.js` checks the whole backend end to end: it calls the running API over HTTP, so every test goes through Express, the PostgreSQL procedures, functions and triggers, and Redis together. It covers:

- **health**: the API can reach the database and Redis
- **authentication**: login validation, wrong password, tokens, protected routes
- **roles**: student vs teacher/super_admin access, the active chatbot prompt
- **personalization**: study events (create, read, update, delete), the trigger that adds a sprint task for each study event, moving and deleting sprint tasks, ownership checks
- **social**: user search, friend requests (send, duplicate, accept), both friends lists updating, removing a friend
- **notifications**: list, unread count, mark all as read, and the notification sent when a friend request is accepted

Run it with the containers up:

```bash
docker compose exec server npm test
```

The end of the output shows `pass` and `fail` counts. A failed test prints what it expected and what it got; check `docker compose logs --tail 50 server` for the matching error.

Things to know:

- It logs in with the [test accounts](#5-check-that-everything-works), so they must exist. If your database was created before `03_test_accounts.sql` was added, load them once:

  ```bash
  docker compose exec -T db psql -U postgres -d Crammbling_DB < docker/db/init/03_test_accounts.sql
  ```

- Everything the tests create is named `apitest-...` and deleted again, so you can re-run them on the same database.
- The API's rate limits allow about **20 runs per hour** (friend requests are limited to 20 per hour). After that the social tests fail with status `429`; wait, or restart the server (`docker compose restart server`) to reset the limits.
- The chatbot itself (Ollama) isn't tested here because it needs the AI model. Use Postman or the app for that.
- **When you add an endpoint, add a test for it** in `server/tests/`. Any file ending in `.test.js` there is picked up by `npm test`.

### 11.2 Testing by hand with Postman

The API runs at `http://localhost:5000`, the same address as without Docker, so the team's Postman collections in `postman/` work unchanged.

1. `POST http://localhost:5000/api/login` with a test account, for example `{ "email": "student1@crammbling.test", "password": "Password123!" }`.
2. Copy the `token` from the response.
3. On protected requests, add the header `Authorization: Bearer <token>`.

---

## 12. Troubleshooting

First step for almost any problem: **look at the logs.**

```bash
docker compose ps
docker compose logs --tail 50 server
```

| Problem | Cause and fix |
|---|---|
| `failed to connect to the docker API` / `cannot find the file specified` / `Is the docker daemon running?` | Docker Desktop isn't running. Open it and wait for "Engine running". |
| `required variable JWT_SECRET is missing a value: Set JWT_SECRET in .env` | You haven't created `.env` in the project root, or a required value is empty. See [section 3.2](#32-create-your-env-file). |
| `TOKEN_ENCRYPTION_KEY must decode to exactly 32 bytes` | Generate the key with the command in [section 3.3](#33-fill-in-the-two-required-secrets). |
| `ports are not available: exposing port TCP 0.0.0.0:5000 ... Only one usage of each socket address is normally permitted` (Windows) or `Bind for 0.0.0.0:5000 failed: port is already allocated` | Another program already uses that port, usually a `npm run dev` you started outside Docker. Stop it (`Ctrl+C` in its terminal), then run `docker compose up -d` again. To find it on Windows: `Get-NetTCPConnection -LocalPort 5000 -State Listen` shows the process ID; `Stop-Process -Id <id>` stops it. For 5433 or 6380, change `DB_HOST_PORT` / `REDIS_HOST_PORT` in `.env` instead. |
| `Redis unavailable at redis://redis:6379 ...` | The server can't reach Redis yet. It keeps retrying and shows `Redis connected` when it succeeds. If it never does, check `docker compose ps redis`. The app still works without Redis, just without caching. |
| `Cannot find module '<package>'` after a pull | A teammate added a package. Run `docker compose up -d --build -V`. |
| Database is missing a table or procedure a teammate added | Your database was created from older scripts. Reset it: `docker compose down -v` then `docker compose up -d`. |
| `relation "..." does not exist` | Same as above, or your code is missing the schema name (write `auth.users`, not `users`). |
| Server keeps restarting (`[nodemon] app crashed`) | A code error. The lines above it in `docker compose logs server` show the file and line. Fix and save; it restarts on its own. |
| Changes don't reload | Run `docker compose restart server` (or `client`). On Windows, file watching uses polling, so allow 1 to 3 seconds. |
| `server` shows **(unhealthy)** in `docker compose ps` | The API is up but can't reach the database. Open http://localhost:5000/api/health to see which part is `down`, then check `docker compose logs --tail 50 db`. |
| API tests fail at `login as student1@crammbling.test failed` | Your database has no test accounts. Load them with the command in [section 11.1](#111-automated-api-tests). |
| pgAdmin can't connect | The containers must be running. Use port **5433**, not 5432. The password is `DB_PASSWORD` from `.env`. |
| Chatbot replies with an error or times out | Ollama isn't running or the model isn't downloaded. See [section 9](#9-the-ai-chatbot-ollama). |
| `no space left on device` | Docker's disk is full. Run `docker system prune` (removes stopped containers and unused images; your database volume is kept). |
| Everything is broken and you want a fresh start | `docker compose down -v`, then `docker compose up --build -V`. This deletes your local database. |

Still stuck? Post in the team chat with the output of `docker compose ps` and `docker compose logs --tail 50 server`. **Remove any secrets from the output first.**

---

## 13. Command cheat sheet

| Task | Command |
|---|---|
| First start / after pulling | `docker compose up -d --build -V` |
| Start | `docker compose up -d` |
| Start with the AI chatbot | `docker compose --profile ai up -d` |
| Stop (keep data) | `docker compose down` |
| Status | `docker compose ps` |
| Follow logs | `docker compose logs -f server` |
| Restart one service | `docker compose restart server` |
| Add a backend package | `docker compose exec server npm install <pkg>` |
| Add a frontend package | `docker compose exec client npm install <pkg>` |
| Run the API tests | `docker compose exec server npm test` |
| Check API, database and Redis | open http://localhost:5000/api/health |
| SQL shell | `docker compose exec db psql -U postgres -d Crammbling_DB` |
| Database viewer in the browser | `docker compose --profile tools up -d adminer` → http://localhost:8080 |
| Export schema after a DB change | see [section 8.3](#83-changing-the-database-tables-procedures-functions-triggers) |
| Reset the database (**deletes data**) | `docker compose down -v` then `docker compose up -d` |
| Shell inside the server | `docker compose exec server sh` |
| Free up disk space | `docker system prune` |

### Never do this

- Don't commit `.env` or paste its contents anywhere public.
- Don't run `npm install` on your computer for `server/` or `client/` while using Docker. Use `docker compose exec ...`.
- Don't change the database without updating `docker/db/init/01_schema.sql`.
- Don't put real user data into `02_seed.sql` or `03_test_accounts.sql`.
