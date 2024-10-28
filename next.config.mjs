/** @type {import('next').NextConfig} */
export default {
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
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' https://trusted-cdn.com https://cdnjs.cloudflare.com https://stackpath.bootstrapcdn.com;
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: https://mdbcdn.b-cdn.net;
              connect-src 'self' http://localhost:8000;
              frame-ancestors 'none';
            `.replace(/\s{2,}/g, ' ').trim(),
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  poweredByHeader: false,
};

// /** @type {import('next').NextConfig} */
// export default {
//   reactStrictMode: true,

//   images: {
//     domains: ['bootdey.com', 'localhost', 'ubcbuddies.onrender.com', 'rfljgrsesttopohfkikg.supabase.co', 'mdbcdn.b-cdn.net'],
//   },

//   async headers() {
//     return [
//       {
//         source: '/(.*)',
//         headers: [
//           { key: 'X-Frame-Options', value: 'DENY' },
//           { key: 'X-Content-Type-Options', value: 'nosniff' },
//           { key: 'X-XSS-Protection', value: '1; mode=block' },
//           { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
//           { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
//           { key: 'Permissions-Policy', value: 'geolocation=(self), microphone=()' },
//           {
//             key: 'Content-Security-Policy',
//             value: `
//               default-src 'self';
//               script-src 'self' https://trusted-cdn.com https://cdnjs.cloudflare.com https://stackpath.bootstrapcdn.com;
//               style-src 'self' 'unsafe-inline';
//               img-src 'self' data: https://mdbcdn.b-cdn.net;
//               connect-src 'self' https://ubcbuddies.onrender.com;
//               frame-ancestors 'none';
//             `.replace(/\s{2,}/g, ' ').trim(),
//           },
//           {
//             key: 'Cache-Control',
//             value: 'public, max-age=31536000, immutable',
//           },
//         ],
//       },
//     ];
//   },

//   poweredByHeader: false,
// };