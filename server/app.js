import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import contactRouter from './routes/contact.js';
import automationAuditRouter from './routes/automation-audit.js';
import namiAIRouter from './routes/nami-ai.js';
import namiAILeadRouter from './routes/nami-ai-lead.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(__dirname, '..', 'dist');

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '100kb' }));

app.use('/api', contactRouter);
app.use('/api', automationAuditRouter);
app.use('/api', namiAIRouter);
app.use('/api', namiAILeadRouter);

// Serves the built Vite app (npm run build) so this one Express app can
// be the entire production deployment on a plain Node host (see
// server/index.js). On Vercel, static files and SPA routing are handled
// by Vercel itself (see vercel.json) and this app only ever receives
// /api/* requests there — this branch is simply never reached on Vercel,
// which is why it's harmless to leave in place for both targets.
app.use(express.static(distPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

export default app;
