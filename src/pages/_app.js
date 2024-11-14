import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import Script from 'next/script';
import App from 'next/app';
import { NonceContext } from '../../context/NonceContext';
import '../styles/globals.css';
import { getProfile } from '../../services/api';

config.autoAddCss = false;

function MyApp({ Component, pageProps, nonce }) {
  const router = useRouter();
  const noNavbarPaths = ['/login', '/signup', '/password-reset', '/activate/[uid]/[token]', '/password/reset/confirm/[uid]/[token]'];
  const publicPaths = ['/login', '/signup', '/password-reset', '/activate/[uid]/[token]', '/password/reset/confirm/[uid]/[token]'];
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const profile = await getProfile();
        
        // ユーザーの状態に応じて適切なページにリダイレクト
        if (profile.cur_matching) {
          router.push('/current-match');
        } else if (profile.wait) {
          router.push('/wait');
        } else if (profile.semi_comp) {
          router.push('/semi-comp');
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);

        // 401エラーが発生した場合、未認証と見なしてログインページにリダイレクト
        if (error.response && error.response.status === 401) {
          if (!publicPaths.includes(router.pathname)) {
            router.push('/login');
          } else {
            setIsLoading(false);
          }
        } else {
          console.error('Failed to load profile information. Please try again later.');
          setIsLoading(false);
        }
      }
    };

    fetchUserData();
  }, [router.pathname]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      require('bootstrap/dist/js/bootstrap.bundle.min.js');
    }
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

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
  
  return { ...appProps, pageProps: { ...appProps.pageProps, nonce } };
};

export default MyApp;