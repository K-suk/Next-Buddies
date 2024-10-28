import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import Script from 'next/script';
import crypto from 'crypto'; // nonce生成用

import '../../public/assets/css/style.css';

config.autoAddCss = false;

function MyApp({ Component, pageProps }) {
    const router = useRouter();
    const noNavbarPaths = ['/login', '/signup', '/password-reset', '/activate/[uid]/[token]', '/password/reset/confirm/[uid]/[token]'];

    // CSPポリシーで使用するnonceを生成
    const nonce = crypto.randomBytes(16).toString('base64');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            require('bootstrap/dist/js/bootstrap.bundle.min.js');
        }
    }, []);

    return (
        <>
            {!noNavbarPaths.includes(router.pathname) && <Navbar />}
            <Component {...pageProps} />

            {/* next/scriptでnonceを使用し、CSPを満たす */}
            <Script
                src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/2.11.6/umd/popper.min.js"
                strategy="beforeInteractive"
                nonce={nonce} // nonceを追加
            />
            <Script
                src="https://stackpath.bootstrapcdn.com/bootstrap/5.1.3/js/bootstrap.bundle.min.js"
                strategy="beforeInteractive"
                nonce={nonce} // nonceを追加
            />
        </>
    );
}

export default MyApp;