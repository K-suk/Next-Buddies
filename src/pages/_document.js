// pages/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document';
import crypto from 'crypto';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);

    // nonceを生成し、全体に渡す
    const nonce = crypto.randomBytes(16).toString('base64');
    return { ...initialProps, nonce };
  }

  render() {
    const { nonce } = this.props;

    return (
      <Html>
        <Head>
          {/* nonceを使ってCSPを適用 */}
          <meta
            httpEquiv="Content-Security-Policy"
            content={`default-src 'self'; style-src 'self' 'nonce-${nonce}' https://trusted-cdn.com https://cdnjs.cloudflare.com https://stackpath.bootstrapcdn.com; script-src 'self' 'nonce-${nonce}' https://cdnjs.cloudflare.com https://stackpath.bootstrapcdn.com; img-src 'self' data: https://mdbcdn.b-cdn.net; connect-src 'self' https://ubcbuddies.onrender.com; frame-ancestors 'none';`}
          />
          {/* 必要なスタイルやスクリプトにnonceを追加 */}
          <style nonce={nonce}>{`/* グローバルスタイルがあればここに追加 */`}</style>
          <script
            nonce={nonce}
            dangerouslySetInnerHTML={{
              __html: `window.__NEXT_DATA__.nonce = "${nonce}";`,
            }}
          />
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