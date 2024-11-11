import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import Script from 'next/script';
import App from 'next/app';
import { NonceContext } from '../../context/NonceContext';

config.autoAddCss = false;

function MyApp({ Component, pageProps, nonce }) {
  const router = useRouter();
  const noNavbarPaths = ['/login', '/signup', '/password-reset', '/activate/[uid]/[token]', '/password/reset/confirm/[uid]/[token]'];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      require('bootstrap/dist/js/bootstrap.bundle.min.js');
    }
  }, []);

  return (
    <NonceContext.Provider value={nonce}>
      <Script id="next-webpack" src="/_next/static/chunks/webpack.js" strategy="beforeInteractive" nonce={nonce} />
      <Script id="next-framework" src="/_next/static/chunks/framework.js" strategy="beforeInteractive" nonce={nonce} />
      <Script id="next-main" src="/_next/static/chunks/main.js" strategy="beforeInteractive" nonce={nonce} />
      <Script id="next-app" src="/_next/static/chunks/pages/_app.js" strategy="beforeInteractive" nonce={nonce} />

      {!noNavbarPaths.includes(router.pathname) && <Navbar />}
      <Component {...pageProps} />
    </NonceContext.Provider>
  );
}

MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);
  const nonce = appContext.ctx.req.headers['x-nonce'] || '';
  console.log(`nonce: ${nonce}`);
  return { ...appProps, pageProps: { ...appProps.pageProps, nonce } };
};

export default MyApp;