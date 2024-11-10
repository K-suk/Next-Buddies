// pages/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document';
import crypto from 'crypto';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    const nonce = crypto.randomBytes(16).toString('base64');
    return { ...initialProps, nonce };
  }

  render() {
    return (
      <Html>
        <Head>
          <meta
            httpEquiv="Content-Security-Policy"
            content={`default-src 'self'; script-src 'self' 'nonce-${this.props.nonce}'; style-src 'self' 'nonce-${this.props.nonce}'; img-src 'self' data:; connect-src 'self';`}
          />
          {/* nonceを__NEXT_DATA__に埋め込み、クライアントサイドで使用できるようにします */}
          <script
            nonce={this.props.nonce}
            dangerouslySetInnerHTML={{
              __html: `window.__NEXT_DATA__ = { nonce: "${this.props.nonce}" }`,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript nonce={this.props.nonce} />
        </body>
      </Html>
    );
  }
}

export default MyDocument;