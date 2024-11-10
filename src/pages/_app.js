// pages/_app.js
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect } from 'react';
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
    const nonce = pageProps.nonce || '';  // pagePropsからnonceを取得
    console.log('Nonce passed to NonceContext.Provider in _app.js:', nonce);  // nonceが取得できているか確認

    useEffect(() => {
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

// getInitialPropsでnonceをpagePropsに追加
MyApp.getInitialProps = async (appContext) => {
    const appProps = await App.getInitialProps(appContext);
    const nonce = appContext.ctx.req ? appContext.ctx.req.nonce : 'nein!';
    console.log(appContext.ctx);
    console.log('Nonce received in _app.js from _document.js:', nonce);

    return { ...appProps, pageProps: { ...appProps.pageProps, nonce } };
};

export default MyApp;