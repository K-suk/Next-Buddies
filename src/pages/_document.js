// pages/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document';
import crypto from 'crypto';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    const nonce = crypto.randomBytes(16).toString('base64'); // nonceの生成
    ctx.res.setHeader('x-nonce', nonce); // nonceをヘッダーにセット
    return { ...initialProps, nonce };
  }

  render() {
    const { nonce } = this.props;
    const isDev = process.env.NODE_ENV === 'development';

    const csp = isDev
      ? `
        default-src 'self';
        script-src 'self' 'nonce-${nonce}' 'unsafe-eval';
        style-src 'self' 'unsafe-inline';
        img-src 'self' data: https://mdbcdn.b-cdn.net https://rfljgrsesttopohfkikg.supabase.co;
        connect-src 'self' https://ubcbuddies.onrender.com https://rfljgrsesttopohfkikg.supabase.co;
      `.replace(/\s{2,}/g, ' ').trim()
      : `
        default-src 'self';
        script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
        style-src 'self' 'nonce-${nonce}' https://trusted-cdn.com https://cdnjs.cloudflare.com https://stackpath.bootstrapcdn.com;
        img-src 'self' data: https://mdbcdn.b-cdn.net https://rfljgrsesttopohfkikg.supabase.co;
        connect-src 'self' https://ubcbuddies.onrender.com https://rfljgrsesttopohfkikg.supabase.co;
      `.replace(/\s{2,}/g, ' ').trim();

    return (
      <Html>
        <Head nonce={nonce}>
          <meta httpEquiv="Content-Security-Policy" content={csp} />
        </Head>
        <body>
          <Main />
          <NextScript nonce={nonce} />
        </body>
      </Html>
    );
  }
}

export default MyDocument;