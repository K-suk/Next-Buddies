import { useRouter } from 'next/router';
import { getProfile } from '../../services/api';
import { useEffect } from 'react';
import styles from '../styles/SemiComp.module.css'; // CSSファイルをインポート

export default function Wait() {
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const profile = await getProfile();

                if (profile.cur_matching) {
                    router.push('/current-match');
                } else if (profile.wait) {
                    router.push('/wait');
                } else if (profile.semi_comp) {
                    router.push('/semi-comp');
                } else {
                    router.push('/home')
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                if (error.response && error.response.status === 401) {
                    console.error('Unauthorized. Redirecting to login.');
                    router.push('/login');
                }
            }
        };

        fetchUserData();
    }, []);

    return (
        <div className={`container ${styles['container-padding-top']}`}>
            <img
                src="/images/BUDDIES.png"
                alt="login form"
                className={`img-fluid mx-auto d-block ${styles['rounded-image']}`}
            />
            <h1 className={styles['text-center-message']}>Please wait for your buddy to finish the matching</h1>
        </div>
    );
}