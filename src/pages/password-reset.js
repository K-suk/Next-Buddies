import { useState } from 'react';
import api from '../../services/api';
import { useRouter } from 'next/router';
import styles from '../styles/PasswordResetRequest.module.css'; // CSSファイルをインポート

export default function PasswordResetRequest() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();

    const isValidEmail = (email) => {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@student\.ubc\.ca$/;
        return emailPattern.test(email);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!isValidEmail(email)) {
            setMessage('Only UBC student email addresses are allowed.');
            return;
        }

        api.post('/auth/users/reset_password/', { email })
            .then(response => {
                setMessage('Password reset email sent. Please check your inbox.');
            })
            .catch(error => {
                console.error('Password Reset Error:', error.response ? error.response.data : error.message);
                setMessage('Failed to send password reset email. Please try again.');
            });
    };

    const handleLogin = () => {
        router.push('/login');
    };

    return (
        <section className={styles['vh-100']}>
            <div className={`container ${styles['container-padding-top']}`}>
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col col-xl-10">
                        <div className={`card ${styles['transparent-card']}`}>
                            <div className="row g-0">
                                <div className="col-md-6 col-lg-7 d-flex align-items-center">
                                    <div className="card-body p-4 p-lg-5 text-white">
                                        <form onSubmit={handleSubmit}>

                                            <h5 className={`fw-normal mb-3 pb-3 ${styles['reset-header']}`}>
                                                Change Your Password
                                            </h5>

                                            <div className="form-outline mb-4">
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className={`form-control form-control-lg ${styles['input-white']}`}
                                                    placeholder="Enter your email"
                                                    required
                                                />
                                            </div>
                                            <div className="pt-1 mb-4">
                                                <button
                                                    className={`btn btn-warning btn-lg btn-block ${styles['btn-large']}`}
                                                    type="submit"
                                                >
                                                    Reset Password
                                                </button>
                                            </div>

                                            {message && <p>{message}</p>}

                                            <div className="pt-1 mb-4">
                                                <button
                                                    className={`btn btn-danger btn-lg btn-block ${styles['btn-large']}`}
                                                    type="button"
                                                    onClick={handleLogin}
                                                >
                                                    Back to Login
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}