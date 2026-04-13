/* ─────────────────────────────────────────────────────────────────────────
   NexT API Configuration
   Single source of truth for the backend URL.
   In production: reads VITE_API_URL from .env.production (set in Vercel)
   In development: reads VITE_API_URL from .env.development (localhost:5000)
───────────────────────────────────────────────────────────────────────── */
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default API_BASE;
