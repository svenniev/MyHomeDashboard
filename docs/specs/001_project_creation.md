# Task 001 — MeerCornCenter Project Creation

## 1. Purpose

Create the initial version of **MeerCornCenter**, a private family web application running on a QNAP NAS through Docker containers.

The app will be used from desktop and mobile browsers on the local network. It will eventually support family budgeting, training logs, body/health logs, goals, and hardware integrations. This task only creates the project foundation, minimal UI pages, authentication, database schema, Docker packaging, and automatic tests.

The implementation must be intentionally minimal. Do not overbuild the business pages. Create clean foundations so later tasks can add detailed workflows.

---

## 2. Key decisions for this task

### 2.1 Database decision

Use **PostgreSQL in a separate Docker container**, orchestrated together with the app through `docker-compose.yml`.

Do **not** install the database directly on the NAS OS.
Do **not** store production data inside the app container.
Do **not** use SQLite for this project unless explicitly requested in a later task.

Rationale:

- QNAP Container Station can run multi-container applications through Docker Compose.
- A separate PostgreSQL container is portable, easy to back up, easy to replace, and closer to normal production practice.
- The app already needs structured relational data plus flexible JSON fields for variable training summaries.
- PostgreSQL `jsonb` is a good fit for training summary payloads whose shape depends on training type.

### 2.2 ORM / migrations decision

Use **Prisma ORM** with PostgreSQL.

Prisma must be used for:

- database schema definition,
- migrations,
- generated type-safe database client,
- seed data.

### 2.3 Authentication decision

Use simple local email/password authentication with a secure server-side session cookie.

Even though the app is intended for LAN use only, still implement these minimum security practices:

- never store plain-text passwords,
- hash passwords with Argon2id or bcrypt,
- use an `httpOnly` session cookie,
- use `sameSite: "lax"`,
- keep session/auth logic on the Express server,
- expose only non-sensitive user data to the frontend and hardware endpoints.

Use **role-free authorization in this MVP**:

- pages such as Goals, Body, Training, Profile, and Admin require a signed-in user,
- the Admin page does **not** require a separate Admin role yet,
- the login and registration pages are available without signing in.

### 2.4 Hardware/public endpoint decision

The rowing-machine odometer will access special API endpoints without browser login.
These endpoints are “public” only in the sense that they do not use browser sessions.
They must still require a simple shared device API key via HTTP header:

```http
X-Device-Api-Key: <configured key>
```

The device API key is stored in `.env` as `DEVICE_API_KEY`.

---

## 3. Technology stack

Use the following stack:

- **Language:** TypeScript everywhere.
- **Backend:** Node.js + Express.
- **Frontend:** React + Vite.
- **UI foundation:** AdminLTE 4 / Bootstrap 5 styling and layout.
- **Database:** PostgreSQL in a separate Docker container.
- **ORM:** Prisma.
- **Validation:** Zod for API request validation.
- **Password hashing:** Argon2id preferred; bcrypt acceptable if Argon2 causes native-build issues on the chosen NAS image.
- **Session storage:** PostgreSQL-backed session store, not in-memory sessions.
- **Testing:** Vitest for frontend and backend tests; Supertest for Express API tests.
- **Containerization:** Dockerfile for app container, `docker-compose.yml` for app + database.

Use npm unless the generated project clearly standardizes on another package manager. Do not mix package managers.

---

## 4. Repository structure

Create this project structure:

```text
MeerCornCenter/
  README.md
  package.json
  package-lock.json
  .gitignore
  .env.example
  docker-compose.yml
  docker-compose.dev.yml
  Dockerfile

  client/
    package.json
    index.html
    vite.config.ts
    tsconfig.json
    src/
      main.tsx
      App.tsx
      routes.tsx
      api/
        httpClient.ts
        authApi.ts
        goalsApi.ts
        bodyApi.ts
        trainingApi.ts
      auth/
        AuthContext.tsx
        RequireAuth.tsx
      layout/
        AppLayout.tsx
        Sidebar.tsx
        Topbar.tsx
        UserMenu.tsx
      pages/
        LandingPage.tsx
        LoginPage.tsx
        RegisterPage.tsx
        ProfilePage.tsx
        GoalsPage.tsx
        BodyCompositionPage.tsx
        TrainingPage.tsx
        AdminPage.tsx
        NotFoundPage.tsx
      styles/
        adminlte.ts
        app.css
      test/
        setup.ts

  server/
    package.json
    tsconfig.json
    prisma/
      schema.prisma
      seed.ts
    src/
      index.ts
      app.ts
      config.ts
      prisma.ts
      middleware/
        errorHandler.ts
        requireAuth.ts
        requireDeviceApiKey.ts
        validateRequest.ts
      modules/
        auth/
          auth.routes.ts
          auth.service.ts
          auth.schemas.ts
        users/
          users.routes.ts
          users.service.ts
          users.schemas.ts
        goals/
          goals.routes.ts
          goals.service.ts
          goals.schemas.ts
        body/
          body.routes.ts
          body.service.ts
          body.schemas.ts
        training/
          training.routes.ts
          training.service.ts
          training.schemas.ts
        device/
          device.routes.ts
          device.schemas.ts
      tests/
        health.test.ts
        auth.test.ts
        goals.test.ts
        body.test.ts
        trainingTypes.test.ts
        device.test.ts
```

The server must expose the built React app in production.
During local development, Vite serves the frontend and proxies `/api` to Express.

---

## 5. Required npm scripts

At root level, create scripts equivalent to these:

```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev --workspace server\" \"npm run dev --workspace client\"",
    "build": "npm run build --workspace client && npm run build --workspace server",
    "test": "npm run test --workspaces",
    "lint": "npm run lint --workspaces",
    "typecheck": "npm run typecheck --workspaces",
    "verify": "npm run typecheck && npm run lint && npm run test && npm run build",
    "docker:build": "docker build -t meercorncenter:local .",
    "docker:up": "docker compose up -d --build",
    "docker:down": "docker compose down"
  },
  "workspaces": [
    "client",
    "server"
  ]
}
```

Client scripts:

```json
{
  "scripts": {
    "dev": "vite --host 0.0.0.0",
    "build": "tsc -b && vite build",
    "preview": "vite preview --host 0.0.0.0",
    "test": "vitest run",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit"
  }
}
```

Server scripts:

```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "vitest run",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:deploy": "prisma migrate deploy",
    "prisma:seed": "tsx prisma/seed.ts"
  }
}
```

The final implementation must pass:

```bash
npm run verify
```

---

## 6. Docker and NAS deployment

### 6.1 Production container behavior

The production app container must:

1. install dependencies,
2. build the React frontend,
3. build the Express backend,
4. copy the frontend build output into the server container,
5. run Prisma migrations on startup,
6. start Express,
7. serve API routes under `/api`,
8. serve the React SPA for all non-API routes.

### 6.2 Docker Compose

Create `docker-compose.yml` with two services:

- `app`
- `db`

Example target shape:

```yaml
services:
  app:
    build: .
    image: meercorncenter:local
    container_name: meercorncenter-app
    restart: unless-stopped
    ports:
      - "8090:3000"
    env_file:
      - .env
    depends_on:
      db:
        condition: service_healthy
    volumes:
      - ./data/uploads:/app/uploads

  db:
    image: postgres:17-alpine
    container_name: meercorncenter-db
    restart: unless-stopped
    environment:
      POSTGRES_DB: meercorncenter
      POSTGRES_USER: meercorncenter
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - ./data/postgres:/var/lib/postgresql/data
      - ./data/backups:/backups
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U meercorncenter -d meercorncenter"]
      interval: 10s
      timeout: 5s
      retries: 5
```

For QNAP Container Station:

- create a Container Station “Application” from this Compose file,
- keep `./data/postgres`, `./data/uploads`, and `./data/backups` on a persistent NAS share,
- never delete `./data/postgres` unless intentionally resetting the database,
- back up the `./data/backups` folder and/or use scheduled `pg_dump`.

### 6.3 Environment variables

Create `.env.example`:

```env
NODE_ENV=production
PORT=3000
APP_PUBLIC_URL=http://nas-ip-or-hostname:8090

POSTGRES_PASSWORD=change-this-password
DATABASE_URL=postgresql://meercorncenter:change-this-password@db:5432/meercorncenter?schema=public

SESSION_SECRET=change-this-long-random-session-secret
DEVICE_API_KEY=change-this-device-api-key

SEED_USER_EMAIL=admin@example.local
SEED_USER_PASSWORD=change-this-initial-password
SEED_USER_FIRST_NAME=Admin
SEED_USER_LAST_NAME=User
SEED_USER_NICKNAME=Admin
```

`SESSION_SECRET`, `POSTGRES_PASSWORD`, and `DEVICE_API_KEY` must not be hardcoded.

---

## 7. Database schema

Implement the following schema in Prisma. Names may be adjusted slightly for Prisma conventions, but the data model must remain equivalent.

### 7.1 ApplicationUser

Purpose: family member account used for browser login and personal data ownership.

Fields:

- `id`: UUID primary key
- `email`: string, unique, required
- `firstName`: string, required
- `middleName`: string, nullable
- `lastName`: string, nullable
- `nickname`: string, nullable
- `heightCm`: decimal, nullable
- `dateOfBirth`: date, nullable
- `profilePicturePath`: string, nullable
- `passwordHash`: string, required
- `createdAt`: datetime
- `updatedAt`: datetime

Relations:

- body composition entries
- goals
- goal value updates
- training logs

### 7.2 BodyCompositionEntry

Purpose: body composition is a log, not a single record.

Fields:

- `id`: UUID primary key
- `userId`: foreign key to `ApplicationUser`
- `measuredAt`: datetime, required
- `weightKg`: decimal, nullable
- `bodyFatPercent`: decimal, nullable
- `musclePercent`: decimal, nullable
- `visceralFatPercent`: decimal, nullable
- `notes`: string, nullable
- `createdAt`: datetime
- `updatedAt`: datetime

Constraints:

- index by `userId`, `measuredAt desc`

### 7.3 Goal

Purpose: user goal that can be displayed as a progress bar regardless of whether the goal is weight, money, distance, count, etc.

Fields:

- `id`: UUID primary key
- `userId`: foreign key to `ApplicationUser`
- `title`: string, required
- `shortDescription`: string, nullable
- `longDescription`: string, nullable
- `startDate`: date, required
- `targetFinishDate`: date, nullable
- `valueType`: enum/string, required, examples: `weight`, `money`, `distance`, `count`, `percent`, `custom`
- `unit`: string, required, examples: `kg`, `HUF`, `km`, `%`, `sessions`
- `direction`: enum/string, required: `increase` or `decrease`
- `startValue`: decimal, required
- `currentValue`: decimal, required
- `targetValue`: decimal, required
- `lastValueUpdateAt`: datetime, nullable
- `isArchived`: boolean, default false
- `createdAt`: datetime
- `updatedAt`: datetime

Progress calculation:

```text
rawProgress = (currentValue - startValue) / (targetValue - startValue)
```

For `direction = decrease`, the formula still works if `targetValue < startValue`.
Clamp the displayed result to the 0–100% range.

Examples:

- Weight goal: start `100 kg`, current `95 kg`, target `88 kg`, direction `decrease`.
- Portfolio goal: start `88,000,000 HUF`, current `91,000,000 HUF`, target `100,000,000 HUF`, direction `increase`.

### 7.4 GoalValueUpdate

Purpose: history of goal progress updates.

Fields:

- `id`: UUID primary key
- `goalId`: foreign key to `Goal`
- `userId`: foreign key to `ApplicationUser`
- `value`: decimal, required
- `updatedAt`: datetime, required
- `note`: string, nullable
- `createdAt`: datetime

Whenever a goal value is updated, also create a `GoalValueUpdate` entry and update `Goal.currentValue` + `Goal.lastValueUpdateAt`.

### 7.5 TrainingType

Purpose: configurable training categories, set up from the Admin page.

Fields:

- `id`: UUID primary key
- `name`: string, required
- `slug`: string, unique, required
- `thumbnailPath`: string, nullable
- `summarySchemaJson`: JSONB, nullable
- `isActive`: boolean, default true
- `createdAt`: datetime
- `updatedAt`: datetime

Examples:

- Rowing Machine
- Running
- Cycling
- Strength Training
- Swimming

### 7.6 TrainingLog

Purpose: one completed workout/training session.

Correct spelling: use `TrainingLog`, not `Tranining Log`.

Fields:

- `id`: UUID primary key
- `userId`: foreign key to `ApplicationUser`
- `trainingTypeId`: foreign key to `TrainingType`
- `startedAt`: datetime, required
- `endedAt`: datetime, nullable
- `durationSeconds`: integer, nullable
- `caloriesConsumed`: integer, nullable
- `summaryJson`: JSONB, required, default `{}`
- `source`: enum/string, required, examples: `manual`, `rowing_odometer`, `import`
- `externalDeviceSessionId`: string, nullable, unique when present
- `createdAt`: datetime
- `updatedAt`: datetime

For the rowing odometer, `summaryJson` may contain fields such as:

```json
{
  "distanceMeters": 5000,
  "durationSeconds": 1240,
  "averageStrokeRate": 27,
  "averagePaceSecondsPer500m": 124,
  "strokes": 558
}
```

---

## 8. Backend API requirements

All API routes are under `/api`.
All JSON responses should use a consistent shape:

```json
{
  "data": {},
  "error": null
}
```

For errors:

```json
{
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human readable message"
  }
}
```

### 8.1 Health

- `GET /api/health`
  - returns `{ status: "ok" }`
  - does not require authentication

### 8.2 Auth

- `POST /api/auth/register`
  - creates a user
  - hashes password
  - signs in user after registration

- `POST /api/auth/login`
  - signs in with email/password

- `POST /api/auth/logout`
  - signs out current session

- `GET /api/auth/me`
  - returns current signed-in user or `null`
  - never returns `passwordHash`

### 8.3 Users / profile

Requires browser authentication.

- `GET /api/users/me`
- `PUT /api/users/me`

Profile update supports:

- first name
- middle name
- last name
- nickname
- height
- date of birth
- profile picture path

Actual image upload can be left minimal in this task. It is acceptable to store a URL/path text field for now.

### 8.4 Goals

Requires browser authentication.

- `GET /api/goals`
- `POST /api/goals`
- `GET /api/goals/:id`
- `PUT /api/goals/:id`
- `DELETE /api/goals/:id`
- `POST /api/goals/:id/value-updates`

Rules:

- A user can only access their own goals.
- `DELETE` may hard-delete in this MVP or set `isArchived = true`; prefer archive if simple.
- Goal progress must be calculated in backend service and also available to the frontend.

### 8.5 Body composition

Requires browser authentication.

- `GET /api/body-composition`
- `POST /api/body-composition`
- `GET /api/body-composition/latest`
- `PUT /api/body-composition/:id`
- `DELETE /api/body-composition/:id`

Rules:

- A user can only access their own body composition entries.
- Return newest entries first.

### 8.6 Training types

Requires browser authentication.
No role check in this MVP.

- `GET /api/training-types`
- `POST /api/training-types`
- `PUT /api/training-types/:id`
- `DELETE /api/training-types/:id`

Rules:

- Deleting may set `isActive = false` if logs already exist.
- Training type names and slugs should be unique enough for user clarity.

### 8.7 Training logs

Requires browser authentication.

- `GET /api/training-logs`
- `POST /api/training-logs`
- `GET /api/training-logs/:id`
- `PUT /api/training-logs/:id`
- `DELETE /api/training-logs/:id`

Rules:

- A user can only access their own training logs.
- `summaryJson` must be accepted as JSON object.

### 8.8 Device endpoints for rowing odometer

Requires `X-Device-Api-Key` header.
Does not require browser authentication.

- `GET /api/device/users`
  - returns only user choices needed by the hardware
  - example fields: `id`, `displayName`, `nickname`, `profilePicturePath`
  - must not return email, birth date, height, password hash, or private data

- `GET /api/device/training-types`
  - returns active training types

- `POST /api/device/training-logs`
  - creates a training log from the rowing odometer
  - request must contain `userId`, `trainingTypeId` or `trainingTypeSlug`, `startedAt`, optional `endedAt`, optional `durationSeconds`, optional `caloriesConsumed`, `summaryJson`, and optional `externalDeviceSessionId`

The endpoint must validate that the target user exists and that the training type exists and is active.

---

## 9. Frontend requirements

### 9.1 General

Use React Router.
Use a central `AuthContext` that loads `/api/auth/me` on startup.
Use an API client wrapper around `fetch`.
Use AdminLTE / Bootstrap layout and classes for the visual shell.
Do not create a complex state-management solution yet.

### 9.2 Layout

Create an AdminLTE-style app layout with:

- sidebar,
- top app bar,
- content area,
- responsive behavior for mobile browsers,
- dark/light mode toggle.

Sidebar header text:

```text
MeerCornCenter
```

Sidebar navigation items:

- Home
- Body
- Training
- Goals
- Admin
- Profile

### 9.3 Appbar

The appbar must include:

- sidebar toggle button,
- simple notifications dropdown placeholder,
- dark/light mode toggle,
- user panel area.

When signed in, the user panel displays:

- user image or placeholder avatar,
- display name,
- quick links: Body, Training, Goals,
- footer buttons: Profile and Sign Out.

When not signed in, show a Sign In button.

### 9.4 Pages

All pages must be minimal but functional.

#### LandingPage

Similar to the default AdminLTE dashboard landing page:

- welcome card,
- a few placeholder statistics cards,
- quick links to Body, Training, Goals.

#### LoginPage

Simple AdminLTE-style login page.

Fields:

- email
- password

Actions:

- sign in
- link to registration

#### RegisterPage

Simple registration page, wizard-like visual style is acceptable but not required.

Fields:

- email
- password
- first name
- middle name
- last name
- nickname
- height cm
- date of birth

After successful registration, sign the user in.

#### ProfilePage

Simple AdminLTE-style profile page.
Display and edit:

- first name
- middle name
- last name
- nickname
- height
- date of birth
- profile picture path

#### GoalsPage

Signed-in users can:

- view their goals,
- create a goal,
- edit a goal,
- update the current goal value,
- see progress bars for all goals.

Minimal table/cards are acceptable.

#### BodyCompositionPage

Signed-in users can:

- view latest body composition metrics,
- add a new entry,
- see recent entries in a simple table.

Show at least:

- weight,
- body fat percent,
- muscle percent,
- visceral fat percent.

#### TrainingPage

Signed-in users can:

- view recent training logs,
- add a manual training log,
- inspect `summaryJson` in a readable way.

This page can be very simple in this task.

#### AdminPage

Signed-in users can manage training types.
No separate Admin role is needed yet.

Features:

- list training types,
- create training type,
- edit training type,
- deactivate/delete training type.

---

## 10. AdminLTE integration guidance

Use AdminLTE 4 as a visual/layout foundation, not as a reason to make the app complex.

Implementation approach:

- install AdminLTE / Bootstrap dependencies through npm,
- import AdminLTE and Bootstrap styles from the client entry point or a dedicated `styles/adminlte.ts`,
- implement React components that use AdminLTE-compatible layout classes,
- keep the pages simple and easy to replace later.

Do not copy large unrelated AdminLTE example pages into the app.
Use only the layout/card/form/dropdown patterns needed for this task.

---

## 11. Validation and error handling

Use Zod schemas for incoming API request bodies and route params.

The backend must:

- reject invalid requests with HTTP 400,
- return consistent error JSON,
- not leak stack traces to the frontend,
- log unexpected errors on the server,
- use async error handling consistently.

Frontend must:

- show a simple error message on failed forms,
- not crash on missing/empty data,
- display loading states where needed.

---

## 12. Seed data

Create a seed script that:

1. creates the initial user from `.env` if no users exist,
2. creates default training types if missing:
   - Rowing Machine
   - Running
   - Cycling
   - Strength Training
   - Walking

The seed script must be idempotent.
Running it multiple times must not duplicate default data.

---

## 13. Tests

Every implementation must include automatic tests.

Minimum backend tests:

- `GET /api/health` returns ok.
- registration creates user and does not return password hash.
- login works with seeded or test user.
- unauthenticated access to protected endpoints is rejected.
- goals progress calculation works for increasing and decreasing goals.
- body composition entries can be created and listed for signed-in user.
- training type CRUD works for signed-in user.
- device endpoints reject missing/wrong API key.
- device user endpoint returns only safe public user fields.
- device training-log upload creates a training log.

Minimum frontend tests:

- app renders without crashing.
- login page renders.
- landing/sidebar contains MeerCornCenter.
- goals page displays progress bar for mocked data.
- signed-out user sees Sign In button.

Testing can use a separate test database.
Do not run tests against the production NAS database.

---

## 14. Coding standards

- Use TypeScript strict mode.
- Prefer small modules and services.
- Keep business logic out of React components when practical.
- Keep database access in services, not directly in route files.
- No hardcoded secrets.
- No commented-out dead code.
- No large placeholder pages.
- No generated code committed except Prisma client artifacts if the chosen setup requires it.
- Avoid unnecessary dependencies.
- Keep the app understandable for later manual development.

---

## 15. Definition of done

This task is complete when:

1. the repository structure exists,
2. backend starts locally,
3. frontend starts locally through Vite,
4. React frontend can call Express APIs,
5. PostgreSQL runs through Docker Compose,
6. Prisma schema and migrations exist,
7. seed data can be created,
8. user can register, sign in, view profile, and sign out,
9. basic pages exist: Landing, Login, Register, Profile, Goals, Body, Training, Admin,
10. goals can be created and progress is displayed,
11. body composition entries can be created and listed,
12. training types can be managed from Admin page,
13. training logs can be manually created,
14. device endpoints exist and require `X-Device-Api-Key`,
15. Docker image builds,
16. app + database can be started through `docker compose up -d --build`,
17. `npm run verify` passes.

---

## 16. Expected final response from the coding agent

After implementation, report:

- files created/changed,
- database/migration files created,
- commands executed,
- test results,
- how to run locally,
- how to run on QNAP through Docker Compose,
- any limitations intentionally left for future tasks.

Do not claim success unless the verification commands actually passed.
