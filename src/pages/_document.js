// pages/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document';
import crypto from 'crypto';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    const nonce = crypto.randomBytes(16).toString('base64');
    console.log('Generated nonce in _document.js:', nonce);  // サーバーサイドログで確認

    // nonceを初期プロパティに追加
    return { ...initialProps, nonce };
  }

  render() {
    const { nonce } = this.props;
    console.log('Rendering with nonce in _document.js:', nonce);  // 再確認のためにログ出力

    return (
      <Html>
        <Head>
          <meta
            httpEquiv="Content-Security-Policy"
            content={`default-src 'self'; script-src 'self' 'nonce-${nonce}' https://cdnjs.cloudflare.com https://stackpath.bootstrapcdn.com https://vercel.live; style-src 'self' 'nonce-${nonce}' https://trusted-cdn.com https://cdnjs.cloudflare.com https://stackpath.bootstrapcdn.com; img-src 'self' data: https://mdbcdn.b-cdn.net; connect-src 'self' https://ubcbuddies.onrender.com;`}
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