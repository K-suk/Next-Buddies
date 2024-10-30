// next.config.mjs
const crypto = require('crypto');

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['bootdey.com', 'localhost', 'ubcbuddies.onrender.com', 'rfljgrsesttopohfkikg.supabase.co', 'mdbcdn.b-cdn.net'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'geolocation=(self), microphone=()' },
          {
            key: 'Content-Security-Policy',
            value: (req, res) => {
              const nonce = crypto.randomBytes(16).toString('base64');
              res.setHeader('Content-Security-Policy', `
                default-src 'self';
                script-src 'self' 'nonce-${nonce}' https://cdnjs.cloudflare.com https://stackpath.bootstrapcdn.com https://vercel.live;
                style-src 'self' 'nonce-${nonce}' https://trusted-cdn.com https://cdnjs.cloudflare.com https://stackpath.bootstrapcdn.com;
                img-src 'self' data: https://mdbcdn.b-cdn.net;
                connect-src 'self' https://ubcbuddies.onrender.com;
                frame-ancestors 'none';
              `.replace(/\s{2,}/g, ' ').trim());
              return res;
            },
          },
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
  poweredByHeader: false,
};

module.exports = nextConfig;