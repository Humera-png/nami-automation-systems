import app from '../server/app.js';

// Vercel entry point: Vercel's Node.js runtime accepts an Express app as
// a request handler directly. vercel.json rewrites /api/* to this
// function; everything else is served as a static file from dist/ by
// Vercel itself, so app.js's own static/SPA-fallback branch is never
// reached here — it exists purely for the standalone-host target
// (server/index.js).
export default app;
