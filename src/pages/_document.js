// pages/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document';
import crypto from 'crypto';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    const nonce = crypto.randomBytes(16).toString('base64');
    console.log('[Server] Generated nonce in _document.js:', nonce);
    
    // nonceをpageProps経由で直接渡すために設定
    ctx.req.nonce = nonce;  // ctx.reqオブジェクトに追加
    return { ...initialProps, nonce };
  }

  render() {
    const { nonce } = this.props.nonce;
    console.log('[Server] Rendering with nonce in _document.js:', nonce);

    // Content-Security-Policyの設定内容を変数として保持
    const csp = `default-src 'self'; script-src 'self' 'nonce-${nonce}' https://cdnjs.cloudflare.com https://stackpath.bootstrapcdn.com https://vercel.live; style-src 'self' 'nonce-${nonce}' https://trusted-cdn.com https://cdnjs.cloudflare.com https://stackpath.bootstrapcdn.com; img-src 'self' data: https://mdbcdn.b-cdn.net; connect-src 'self' https://ubcbuddies.onrender.com;`;

    return (
      <Html>
        <Head nonce={nonce}>
          <meta
            httpEquiv="Content-Security-Policy"
            content={csp}  // 変数cspを渡す
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