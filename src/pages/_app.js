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
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/2.11.6/umd/popper.min.js" strategy="beforeInteractive" nonce={nonce}></Script>
      <Script src="https://stackpath.bootstrapcdn.com/bootstrap/5.1.3/js/bootstrap.min.js" strategy="beforeInteractive" nonce={nonce}></Script>
      {!noNavbarPaths.includes(router.pathname) && <Navbar />}
      <Component {...pageProps} />
    </NonceContext.Provider>
  );
}

MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);
  
  // reqが存在する場合にのみnonceを取得
  const nonce = appContext.ctx.req ? appContext.ctx.req.headers['x-nonce'] || '' : '';
  console.log(`nonce: ${nonce}`);
  console.log(appContext.ctx.req);
  
  return { ...appProps, pageProps: { ...appProps.pageProps, nonce } };
};

export default MyApp;