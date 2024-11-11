import { useState } from 'react';
import { useRouter } from 'next/router';
import { login } from '../../services/api';
import { useNonce } from '../../context/NonceContext';

export default function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const nonce = useNonce();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email.endsWith('@student.ubc.ca')) {
            setMessage('Only email addresses ending with @student.ubc.ca are allowed.');
            return;
        }

        setLoading(true);
        try {
            const response = await login(formData.email, formData.password);
            if (response && response.access) {
                localStorage.setItem('access_token', response.access);
                localStorage.setItem('refresh_token', response.refresh);
                setMessage('Login Success: Redirecting to home...');
                router.push('/home');
            } else {
                setMessage('Login failed: Token not received.');
                console.error('Login failed: Token not received.');
            }
        } catch (error) {
            console.error('Login Error:', error.response ? error.response.data : error.message);
            setMessage('Login failed. Please try again.');
        }
        setLoading(false);
    };

    const handlePasswordReset = () => {
        router.push('/password-reset');
    };

    const handleSignUp = () => {
        router.push('/signup');
    };

    return (
        <section className="vh-100">
            <div className="container h-100 py-5">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col col-xl-10">
                        <div className="card transparent-card">
                            <div className="row g-0">
                                <div className="col-md-6 col-lg-5 d-none d-md-block">
                                    <img
                                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
                                        alt="login form"
                                        className="img-fluid"
                                    />
                                </div>
                                <div className="col-md-6 col-lg-7 d-flex align-items-center">
                                    <div className="card-body p-4 p-lg-5 text-white">
                                        <form onSubmit={handleSubmit}>
                                            <div className="d-flex pb-1">
                                                <img 
                                                    src='/images/logo.png' 
                                                    alt='logo' 
                                                    className='img-fluid'
                                                />
                                            </div>

                                            <h5 className="fw-normal mb-3 pb-3 text-white">
                                                Sign into your account
                                            </h5>

                                            <div className="form-outline mb-4">
                                                <input
                                                    type="email"
                                                    id="form2Example17"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className="form-control form-control-lg input-white"
                                                    placeholder="Student Email (CWL@student.ubc.ca)"
                                                    required
                                                />
                                            </div>

                                            <div className="form-outline mb-4">
                                                <input
                                                    type="password"
                                                    id="form2Example27"
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    className="form-control form-control-lg input-white"
                                                    placeholder="Password"
                                                    required
                                                />
                                            </div>

                                            <div className="pt-1 mb-4">
                                                {loading ?
                                                    <button className="btn btn-dark btn-lg btn-block">Loading...</button>
                                                : 
                                                    <button className="btn btn-dark btn-lg btn-block" type="submit">Login</button>
                                                }
                                            </div>

                                            {message && <p>{message}</p>}

                                            <a className="small text-white-link" onClick={handlePasswordReset}>
                                                Forgot password?
                                            </a>
                                            <p className="mb-5 pb-lg-2 text-white-link" onClick={handleSignUp}>
                                                Don&apos;t have an account? <span className="text-white-link">Register here</span>
                                            </p>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style jsx nonce={nonce}>{`
                .vh-100 {
                    height: 100vh;
                    background: linear-gradient(to bottom, #000066 0%, #cc00cc 100%);
                }

                .transparent-card {
                    background-color: transparent;
                    border: none;
                }

                .input-white {
                    color: white !important;
                    background-color: transparent;
                    border-color: rgba(255, 255, 255, 0.3);
                }

                .input-white:focus {
                    color: white !important;
                    background-color: transparent;
                    border-color: rgba(255, 255, 255, 0.5);
                    outline: none;
                    box-shadow: none;
                }

                .input-white::placeholder {
                    color: rgba(255, 255, 255, 0.7);
                }

                .text-white-link {
                    color: #FFFFFF;
                    cursor: pointer;
                    text-decoration: none;
                }
            `}</style>
        </section>
    );
}