# Shop Backend (Node.js + Express)

This project is an MVC + service-layer Node.js backend for the provided PostgreSQL schema.

## Quick start

1. Copy `.env.example` to `.env` and edit values (DATABASE_URL, JWT_SECRET).
2. Create the database and run the SQL in `db/schema.sql` to create tables.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start server:
   ```bash
   npm run dev
   ```

API endpoints are under `/api/v1`. See controllers and routes for details.