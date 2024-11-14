import { useState } from 'react';
import { useRouter } from 'next/router';
import api from '../../services/api';
import styles from '../styles/SignUp.module.css';

export default function SignUp() {
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        password: '',
        re_password: '',
    });
    const [message, setMessage] = useState('');
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!formData.email.endsWith('@student.ubc.ca')) {
            setMessage('Only email addresses ending with @student.ubc.ca are allowed.');
            return;
        }
    
        const namePattern = /^[A-Za-z\s]+$/;
        if (!namePattern.test(formData.name)) {
            setMessage('Name can only contain letters and spaces.');
            return;
        }
    
        if (formData.password !== formData.re_password) {
            setMessage('Passwords do not match.');
            return;
        }
    
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordPattern.test(formData.password)) {
            setMessage('Password must be at least 8 characters, include an uppercase letter and a number.');
            return;
        }
    
        setLoading(true);
        try {
            const response = await api.post('/auth/users/', formData);
            setMessage('User registered successfully. Please check your email to activate your account.');
        } catch (error) {
            if (error.response) {
                console.error('Signup Error Response:', error.response.data);
            } else {
                console.error('Signup Error:', error.message);
            }
            setMessage('Registration failed. Please try again.');
        }
        setLoading(false);
    };

    const handleLogin = () => {
        router.push('/login');
    };

    return (
        <section className={styles['vh-100']}>
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col col-xl-10">
                        <div className={styles['transparent-card']}>
                            <div className="row g-0">
                                <div className="col-md-6 col-lg-5 d-none d-md-block">
                                    <img
                                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
                                        alt="signup form"
                                        className={`img-fluid ${styles['rounded-left-image']}`}
                                    />
                                </div>
                                <div className="col-md-6 col-lg-7 d-flex align-items-center">
                                    <div className="card-body p-4 p-lg-5 text-white">
                                        <form onSubmit={handleSubmit}>
                                            <div className="d-flex align-items-center pb-1">
                                                <img 
                                                    src='/images/logo.png' 
                                                    alt='logo' 
                                                    className='img-fluid'
                                                    width={200}
                                                />
                                            </div>
                                            <h5 className={`fw-normal pb-3 ${styles['header-spacing']}`}>Sign Up</h5>

                                            <div className="form-outline mb-4">
                                                <input
                                                    type="email"
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
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className={`form-control form-control-lg ${styles['input-white']}`}
                                                    placeholder="Your Name"
                                                    maxLength="50"
                                                    required
                                                />
                                            </div>
                                            <div className="form-outline mb-4">
                                                <input
                                                    type="password"
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    className={`form-control form-control-lg ${styles['input-white']}`}
                                                    placeholder="Password"
                                                    required
                                                />
                                            </div>

                                            <div className="form-outline mb-4">
                                                <input
                                                    type="password"
                                                    name="re_password"
                                                    value={formData.re_password}
                                                    onChange={handleChange}
                                                    className={`form-control form-control-lg ${styles['input-white']}`}
                                                    placeholder="Retype Password"
                                                    required
                                                />
                                            </div>

                                            <div className="pt-1 mb-4">
                                                {loading ?
                                                    <button className="btn btn-dark btn-lg btn-block">Loading...</button>
                                                : 
                                                    <button className="btn btn-dark btn-lg btn-block" type="submit">Sign up</button>
                                                }
                                            </div>

                                            {message && <p className="text-success">{message}</p>}

                                            <p className={`mb-5 pb-lg-2 ${styles['text-white-link']}`} onClick={handleLogin}>
                                                Already have an account? <a href="#!" className={styles['text-white-link']}>Login here</a>
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