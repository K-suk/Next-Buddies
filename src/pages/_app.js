// pages/_app.js
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import Script from 'next/script';
import App from 'next/app';
import { NonceContext } from '../../context/NonceContext';

import '../../public/assets/css/style.css';

config.autoAddCss = false;

function MyApp({ Component, pageProps }) {
    const router = useRouter();
    const noNavbarPaths = ['/login', '/signup', '/password-reset', '/activate/[uid]/[token]', '/password/reset/confirm/[uid]/[token]'];
    const [nonce, setNonce] = useState('');

    useEffect(() => {
        // nonceがundefinedでないことを確認
        if (typeof window !== 'undefined' && window.__NEXT_DATA__.props && window.__NEXT_DATA__.props.nonce) {
            const clientNonce = window.__NEXT_DATA__.props.nonce;
            console.log('Nonce from window.__NEXT_DATA__.props in _app.js:', clientNonce);  // クライアントサイドで確認
            setNonce(clientNonce);
        } else {
            console.warn('Nonce not found in window.__NEXT_DATA__.props');
        }
        if (typeof window !== 'undefined') {
            require('bootstrap/dist/js/bootstrap.bundle.min.js');
        }
    }, []);

    return (
        <NonceContext.Provider value={nonce}>
            {!noNavbarPaths.includes(router.pathname) && <Navbar />}
            <Component {...pageProps} />

            {/* Scriptタグにnonceを追加 */}
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
        </NonceContext.Provider>
    );
}

MyApp.getInitialProps = async (appContext) => {
    const appProps = await App.getInitialProps(appContext);
    return { ...appProps };
};

export default MyApp;