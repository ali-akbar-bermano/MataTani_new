import express from 'express';
import path from 'path';
import fs from 'fs';
import app from './api/_app.ts';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

async function startServer() {
  const isCjsBundle = typeof __filename !== 'undefined' && __filename.endsWith('.cjs');
  const isProduction = process.env.NODE_ENV === 'production' || isCjsBundle;

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = (typeof __dirname !== 'undefined' && fs.existsSync(path.join(__dirname, 'index.html')))
      ? __dirname
      : path.join(process.cwd(), 'dist');

    app.use(express.static(distPath));

    const uploadsInDist = path.join(distPath, 'uploads');
    if (fs.existsSync(uploadsInDist)) {
      app.use('/uploads', express.static(uploadsInDist));
    }

    app.get('*', (req, res) => {
      if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'Endpoint API tidak ditemukan' });
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌾 Agri-Vision Server listening on http://0.0.0.0:${PORT} [mode: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}]`);
  });
}

// Hanya jalankan listener mandiri di lingkungan non-serverless (Local dev / Container / AI Studio)
if (!process.env.VERCEL && process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
export { app };
