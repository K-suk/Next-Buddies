import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import api from '../../../../services/api';
import '../../../styles/Activate.css'; // 新しいCSSファイルをインポート

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
        <div className="activate-container">
            <h1>Account Activation</h1>
            <p className="activate-message">{message}</p>
            <p className="activate-message">Even though it says Activation failed, most of time it success. So please try to login. If it still does not work, email to buddies872@gmail.com</p>
            <button className="activate-button" onClick={handleLogin}>Go to Login Page</button>
        </div>
    );
}