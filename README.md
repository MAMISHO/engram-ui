# Engram UI

Engram UI is a local-first web interface designed to view, search, and analyze memories and sessions captured by [Engram AI](https://github.com/google/engram) (an persistent memory service for AI coding agents).

## Project Structure

This project is set up as a monorepo consisting of:
* **`/backend` (NestJS):** Connects to the SQLite database (`engram.db`) via Sequelize and provides high-performance APIs for session paginating, telemetry statistics, full-text searching (FTS5), and project-specific metrics.
* **`/frontend` (Angular & PrimeNG):** A premium web client configured with dark theme styling, custom layouts, tabbed explorers, and interactive dashboard charts.
* **`/bin`:** Command-line development script to start backend and frontend servers concurrently.

---

## Features

1. **Telemetry Dashboard:** Live view of total sessions, tag distributions (types of observations like plan, decision, bugfix), and coding activity timeline charts.
2. **Full-Text Search (FTS5):** Instant full-text search across all persistent agent observations (memories) joining session details.
3. **Projects Explorer (`/projects`):**
   * Sidebar listing all active projects with session counts.
   * Specific dashboards showing project KPI metrics (Total Sessions, Total Memories, Last Active).
   * Project-specific search filtering with type exclusions.
   * **Saved Filters:** Ability to name and save custom filter queries directly inside `localStorage` for quick re-use.
   * Tabbed views showing Sessions lists (with markdown summaries), Memories, and analytics charts.

---

## Requirements

* **Node.js** (v18 or higher recommended)
* **SQLite** (must support FTS5 virtual tables)
* **Engram CLI / DB**: A populated `engram.db` database. By default, it is expected in `~/.engram/engram.db`.

---

## Configuration

To customize ports or database path, copy or create a `.env` file in the root directory:

```env
PORT=3000
FRONTEND_PORT=4200
ENGRAM_DB_PATH=/Users/your-username/.engram/engram.db
```

* `PORT`: Port where the NestJS backend API will run (default: `3000`).
* `FRONTEND_PORT`: Port where the Angular development server will run (default: `4200`).
* `ENGRAM_DB_PATH`: Absolute path to your local `engram.db` SQLite database file.

---

## Installation & Execution

### 1. Install Dependencies
Install all package dependencies in the root, backend, and frontend directories:
```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 2. Run in Development Mode
To start both backend and frontend development servers concurrently with hot-reloading:
```bash
npm run start:dev
```
Once started, visit: **[http://localhost:4200](http://localhost:4200)** (the dev server is pre-configured to proxy `/api` calls to the backend running on port `3000`).

### 3. Build & Run in Production
To compile the Angular client, copy output static files into NestJS public assets folder, and start the unified backend production server:
```bash
npm run start:prod
```
The application will serve both API and frontend on: **[http://localhost:3000](http://localhost:3000)**.
