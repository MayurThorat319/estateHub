# EstateHub — single-project React + Express + MongoDB

React lives in `src/`. The backend lives in `server/`. All components keep their separate CSS files.

## Windows setup

1. Install and start MongoDB Community Server (Compass alone is not a server).
2. Open this folder in VS Code, then run `npm install` in the project root.
3. Use the included `.env` for local MongoDB or copy `.env.example` to `.env`.
4. Run `npm run dev`. This runs Vite on http://localhost:5173 and Express on http://localhost:5000.
5. Check http://localhost:5000/api/health — it returns JSON with status `ok` if the server is running.
6. Connect Compass to `mongodb://127.0.0.1:27017` and open the `estatehub` database once data is saved.

## Data

The database begins empty. Add properties through the UI. Optional `npm run seed` adds **demo data**, not real transactions. Do not use seed if you don't want sample records.

## Notes

`npm install` is required: the original ZIP's `package.json` omitted backend dependencies. The uploaded `node_modules` folder was deliberately excluded from this ZIP to avoid bundling machine-specific Windows binaries. The original layout and component styles were preserved.
