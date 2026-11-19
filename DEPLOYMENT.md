# EstateHub deployment

Use Node.js 22 (22.12 or later). Install with `npm ci`.
For local use, copy `.env.example` to `.env` and set MONGODB_URI, then run `npm run dev`. Open http://127.0.0.1:5173. `npm run build` creates dist. `npm run preview` requires the local API running separately.

For Vercel, import this directory from GitHub, select Vite, build command `npm run build`, output directory `dist`, Node 22.x. Set MONGODB_URI to your MongoDB Atlas connection string, including the estatehub database name. No VITE_API_URL is needed. The API uses the same origin and the catch-all function under api/. Configure Atlas database user and network access for Vercel. Test `/api/health` and `/api/properties` after deployment. The database must be reachable for health to return ok.

Changes by one browser are stored in MongoDB. Other visible tabs refresh every 30 seconds and when focused. This is polling, not push-based realtime. The current dashboard has no login or authorization; do not expose real data on an unrestricted public deployment. Use access protection covering both frontend and API, or implement proper server-side authentication and role checks before going public. The existing in-memory API rate limiter is not a distributed quota or authentication layer.

The optional `npm run seed` adds demo data to empty collections. Do not use it for migration of existing records. To migrate existing data, back it up and restore to Atlas using MongoDB tools.

The original .env, .git, node_modules and build output are intentionally excluded. Keep secrets outside Git and rotate any previously exposed credentials.
