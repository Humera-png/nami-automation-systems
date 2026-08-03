import app from './app.js';

// Standalone entry point for any plain Node host (not Vercel — see
// api/index.js + vercel.json for that target). Run with `npm run server`
// in dev, or `npm start` in production (builds the frontend first, then
// serves both the API and the built app from this one process).
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`NAMI server listening on http://localhost:${PORT}`);
});
