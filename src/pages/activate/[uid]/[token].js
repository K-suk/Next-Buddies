import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import api from '../../../../services/api';

export default function Activate() {
    const router = useRouter();
    const { uid, token } = router.query;
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false); // Loading状態を追加

    useEffect(() => {
        if (uid && token) {
            api.post('/auth/users/activation/', { uid, token })
                .then(response => {
                    setMessage('Your account has been activated successfully!');
                })
                .catch(error => {
                    setMessage('Activation failed. Please try again.');
                });
        }
    }, [uid, token]);

    const handleLogin = () => {
        router.push('/login');
    };

    return (
        <>
            <div>
                <h1>Account Activation</h1>
                <p className='text-white'>{message}</p>
                <p className='text-white'>Even though it says Activation failed, most of time it success. So please try to login. If it still does not work, email to buddies872@gmail.com</p>
                <button className="btn btn-dark btn-lg btn-block" onClick={handleLogin}>Go to Login Page</button>
            </div>
        </>
    );
}