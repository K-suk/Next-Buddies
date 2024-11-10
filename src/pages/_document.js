// pages/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document';
import crypto from 'crypto';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    const nonce = crypto.randomBytes(16).toString('base64');
    console.log('[Server] Generated nonce in _document.js:', nonce);
    return { ...initialProps, nonce };
  }

  render() {
    const { nonce } = this.props;
    const csp = `
      default-src 'self';
      script-src 'self' 'nonce-${nonce}' https://cdnjs.cloudflare.com https://stackpath.bootstrapcdn.com https://vercel.live;
      style-src 'self' 'nonce-${nonce}' https://trusted-cdn.com https://cdnjs.cloudflare.com https://stackpath.bootstrapcdn.com;
      img-src 'self' data: https://mdbcdn.b-cdn.net;
      connect-src 'self' https://ubcbuddies.onrender.com;
    `.replace(/\s{2,}/g, ' ').trim();

    return (
      <Html>
        <Head>
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