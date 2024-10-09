/** @type {import('next').NextConfig} */
export default {
  reactStrictMode: true, // ReactのStrictモードを有効化

  // 画像のドメイン許可設定
  images: {
    domains: ['bootdey.com', 'localhost', 'ubcbuddies.onrender.com', 'rfljgrsesttopohfkikg.supabase.co'], // 許可された画像ドメイン
  },

  // リダイレクト設定 (HTTPをHTTPSにリダイレクト)
  async redirects() {
    return [
      {
        source: '/(.*)',
        has: [{ type: 'host', value: 'example.com' }], // ドメイン名に合わせて変更
        destination: 'https://example.com/:path*', // HTTPSにリダイレクト
        permanent: true,
      },
    ];
  },

  // セキュリティヘッダーとキャッシュ制御
  async headers() {
    return [
      {
        source: '/(.*)', // 全てのルートに対して適用
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },  // クリックジャッキング対策
          { key: 'X-Content-Type-Options', value: 'nosniff' },  // MIMEタイプスニッフィング防止
          { key: 'X-XSS-Protection', value: '1; mode=block' },  // XSS攻撃対策
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },  // HSTS (HTTPSの強制)
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },  // リファラーポリシー
          { key: 'Permissions-Policy', value: 'geolocation=(self), microphone=()' },  // 権限ポリシー
          { 
            key: 'Content-Security-Policy',  // Content Security Policy (CSP)
            value: "default-src 'self'; script-src 'self' https://trusted-cdn.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://bootdey.com https://ubcbuddies.onrender.com https://rfljgrsesttopohfkikg.supabase.co; connect-src 'self'; frame-ancestors 'none';",
          },
          {
            key: 'Cache-Control', // キャッシュポリシー
            value: 'public, max-age=31536000, immutable', // 長期間キャッシュ
          },
        ],
      },
    ];
  },

  poweredByHeader: false, // "X-Powered-By: Next.js" ヘッダーを削除してNext.jsの存在を隠す
};