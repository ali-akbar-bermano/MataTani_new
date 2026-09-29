import app from './_app.ts';

// Menonaktifkan bodyParser bawaan Vercel agar Express menangani stream request dan body secara native
export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default function handler(req: any, res: any) {
  try {
    return app(req, res);
  } catch (error: any) {
    console.error('[Vercel Serverless Function Error]:', error);
    if (!res.headersSent) {
      res.status(500).json({
        status: 'error',
        message: error?.message || 'Terjadi kesalahan internal pada serverless function Vercel.',
      });
    }
  }
}
