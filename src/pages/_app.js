// pages/_app.js
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar'; // defaultインポート
import '@fortawesome/fontawesome-svg-core/styles.css'; // FontAwesomeのCSS
import { config } from '@fortawesome/fontawesome-svg-core';
import Script from 'next/script'; // Scriptコンポーネントのインポート

import '../../public/assets/css/style.css';

config.autoAddCss = false; // FontAwesomeの自動CSS追加を無効化

function MyApp({ Component, pageProps }) {
    const router = useRouter();
    const noNavbarPaths = ['/login', '/signup', '/password-reset', '/activate/[uid]/[token]', '/password/reset/confirm/[uid]/[token]'];

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // 必要なJSファイルの動的インポート
            require('bootstrap/dist/js/bootstrap.bundle.min.js');
            // require('../../public/assets/vendors/js/vendor.bundle.base.js');
            // require('../../public/assets/js/misc.js');
        }
    }, []);

    return (
        <>
            {!noNavbarPaths.includes(router.pathname) && <Navbar />}
            <Component {...pageProps} />
            {/* Bootstrap関連スクリプト */}
            <Script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/2.11.6/umd/popper.min.js" strategy="beforeInteractive"></Script>
            <Script src="https://stackpath.bootstrapcdn.com/bootstrap/5.1.3/js/bootstrap.min.js" strategy="beforeInteractive"></Script>
        </>
    );
}

export default MyApp;