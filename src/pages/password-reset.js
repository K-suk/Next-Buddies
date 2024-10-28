import { useState } from 'react';
import api from '../../services/api';
import { useRouter } from 'next/router';
import '../styles/PasswordResetRequest.css'; // CSSファイルをインポート

export default function PasswordResetRequest() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!email.endsWith('@student.ubc.ca')) {
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
        <section className="vh-100">
            <div className="container container-margin-top">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col col-xl-10">
                        <div className="card transparent-card">
                            <div className="row g-0">
                                <div className="col-md-6 col-lg-7 d-flex align-items-center">
                                    <div className="card-body p-4 p-lg-5 text-white">
                                        <form onSubmit={handleSubmit}>

                                            <h5 className="fw-normal mb-3 pb-3 reset-header">
                                                Change Your Password
                                            </h5>

                                            <div className="form-outline mb-4">
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="form-control form-control-lg input-white"
                                                    placeholder="Enter your email"
                                                    required
                                                />
                                            </div>
                                            <div className="pt-1 mb-4">
                                                <button
                                                    className="btn btn-warning btn-lg btn-block btn-large"
                                                    type="submit"
                                                >
                                                    Reset Password
                                                </button>
                                            </div>

                                            {message && <p>{message}</p>}

                                            <div className="pt-1 mb-4">
                                                <button
                                                    className="btn btn-danger btn-lg btn-block btn-large"
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