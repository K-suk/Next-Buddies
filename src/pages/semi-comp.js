// pages/wait.js
import { useRouter } from 'next/router';
import { getProfile } from '../../services/api';
import { useEffect } from 'react';

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
        <div className='container' style={{ paddingTop: '100px' }}>
            <img
                src="/images/BUDDIES.png"
                alt="login form"
                className="img-fluid mx-auto d-block"
                style={{ borderRadius: '1rem 0 0 1rem', border: 'none' }}
            />
            <h1 className='text-center'>Please wait for your buddy to finish the matching</h1>
        </div>
    );
}