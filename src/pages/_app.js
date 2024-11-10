// pages/_app.js
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import Script from 'next/script';
import App from 'next/app';
import { NonceProvider } from '../context/NonceContext'; // NonceProviderをインポート

import '../../public/assets/css/style.css';

config.autoAddCss = false;

function MyApp({ Component, pageProps }) {
    const router = useRouter();
    const noNavbarPaths = ['/login', '/signup', '/password-reset', '/activate/[uid]/[token]', '/password/reset/confirm/[uid]/[token]'];
    const nonce = typeof window !== 'undefined' && window.__NEXT_DATA__.nonce ? window.__NEXT_DATA__.nonce : '';

    useEffect(() => {
        if (typeof window !== 'undefined') {
            require('bootstrap/dist/js/bootstrap.bundle.min.js');
        }
    }, []);

    return (
        <NonceProvider nonce={nonce}>
            {!noNavbarPaths.includes(router.pathname) && <Navbar />}
            <Component {...pageProps} />

            <Script
                src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/2.11.6/umd/popper.min.js"
                strategy="beforeInteractive"
                nonce={nonce}
            />
            <Script
                src="https://stackpath.bootstrapcdn.com/bootstrap/5.1.3/js/bootstrap.bundle.min.js"
                strategy="beforeInteractive"
                nonce={nonce}
            />
        </NonceProvider>
    );
}

// App.getInitialPropsを使用して、初期プロパティを取得
MyApp.getInitialProps = async (appContext) => {
    const appProps = await App.getInitialProps(appContext);
    return { ...appProps };
};

export default MyApp;