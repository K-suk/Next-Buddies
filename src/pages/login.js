import { useState } from 'react';
import { useRouter } from 'next/router';
import { login } from '../../services/api';

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await login(formData.email, formData.password);
            setMessage('Login successful! Redirecting...');
            router.push('/home');
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
        <section className="vh-100" style={{ background: 'linear-gradient(to bottom, #000066 0%, #cc00cc 100%)' }}>
            <div className="container h-100 py-5">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col col-xl-10">
                        <div className="card" style={{ backgroundColor: 'transparent', border: 'none'}}>
                            <div className="row g-0">
                                <div className="col-md-6 col-lg-5 d-none d-md-block">
                                    <img
                                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
                                        alt="login form"
                                        className="img-fluid"
                                        style={{ borderRadius: '1rem 0 0 1rem', border: 'none' }}
                                    />
                                </div>
                                <div className="col-md-6 col-lg-7 d-flex align-items-center">
                                    <div className="card-body p-4 p-lg-5 text-white">
                                        <form onSubmit={handleSubmit}>
                                            <div className="d-flex pb-1">
                                                {/* <span className="h1 fw-bold mb-0">Logo</span> */}
                                                <img 
                                                    src='/images/logo.png' 
                                                    alt='logo' 
                                                    className='img-fluid'
                                                />
                                            </div>

                                            <h5 className="fw-normal mb-3 pb-3" style={{ letterSpacing: '1px' }}>
                                                Sign into your account
                                            </h5>

                                            <div className="form-outline mb-4">
                                                <input
                                                    type="email"
                                                    id="form2Example17"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className="form-control form-control-lg"
                                                    placeholder="Email"
                                                    style={{ color: 'white' }}
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
                                                    className="form-control form-control-lg"
                                                    placeholder="Password"
                                                    style={{ color: 'white' }}
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

                                            <a className="small" onClick={handlePasswordReset} style={{ color: '#FFFFFF' }}>
                                                Forgot password?
                                            </a>
                                            <p className="mb-5 pb-lg-2 text-white" style={{ color: '#FFFFFF' }} onClick={handleSignUp}>
                                                Don't have an account? <a href="#!" style={{ color: '#FFFFFF' }}>Register here</a>
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