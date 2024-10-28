// pages/_app.js
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import Script from 'next/script';

import '../../public/assets/css/style.css';

config.autoAddCss = false;

function MyApp({ Component, pageProps }) {
    const router = useRouter();
    const noNavbarPaths = ['/login', '/signup', '/password-reset', '/activate/[uid]/[token]', '/password/reset/confirm/[uid]/[token]'];

    useEffect(() => {
        if (typeof window !== 'undefined') {
            require('bootstrap/dist/js/bootstrap.bundle.min.js');
        }
    }, []);

    return (
        <>
            {!noNavbarPaths.includes(router.pathname) && <Navbar />}
            <Component {...pageProps} />

            {/* next/scriptを使用して外部スクリプトを読み込む */}
            <Script
                src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/2.11.6/umd/popper.min.js"
                strategy="beforeInteractive"
            />
            <Script
                src="https://stackpath.bootstrapcdn.com/bootstrap/5.1.3/js/bootstrap.bundle.min.js"
                strategy="beforeInteractive"
            />
        </>
    );
}

export default MyApp;