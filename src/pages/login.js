import { useState } from 'react';
import { useRouter } from 'next/router';
import { login } from '../../services/api';
import styles from '../styles/Login.module.css';
import Link from 'next/link';

export default function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     console.log("Submitting form with data:", formData);

    //     if (!formData.email.endsWith('@student.ubc.ca')) {
    //         setMessage('Only email addresses ending with @student.ubc.ca are allowed.');
    //         return;
    //     }

    //     setLoading(true);
    //     try {
    //         const response = await login(formData.email, formData.password);
    //         console.log("Login response:", response);
    //         if (response && response.access) {
    //             localStorage.setItem('access_token', response.access);
    //             localStorage.setItem('refresh_token', response.refresh);
    //             setMessage('Login Success: Redirecting to home...');
    //             router.push('/home');
    //         } else {
    //             setMessage('Login failed: Token not received.');
    //             console.error('Login failed: Token not received.');
    //         }
    //     } catch (error) {
    //         console.error('Login Error:', error.response ? error.response.data : error.message);
    //         setMessage('Login failed. Please try again.');
    //     }
    //     setLoading(false);
    // };
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
                
                // router.pushの代わりにwindow.location.hrefを使用
                window.location.href = '/home';
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
        <section className={`${styles['vh-100']}`}>
            <div className="container h-100 py-5">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col col-xl-10">
                        <div className={`card ${styles['transparent-card']}`}>
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
                                                    className={`form-control form-control-lg ${styles['input-white']}`}
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
                                                    className={`form-control form-control-lg ${styles['input-white']}`}
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

                                            <Link href="/password-reset" legacyBehavior passHref>
                                                <a className={`small ${styles['text-white-link']}`}>Forgot password?</a>
                                            </Link>
                                            <p className={`mb-5 pb-lg-2 ${styles['text-white-link']}`}>
                                                Don&apos;t have an account?{' '}
                                                <Link href="/signup" legacyBehavior passHref>
                                                    <a className={`${styles['text-white-link']}`}>Register here</a>
                                                </Link>
                                            </p>
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