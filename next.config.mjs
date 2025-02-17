export default {
  reactStrictMode: false,
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
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
  poweredByHeader: false,
};