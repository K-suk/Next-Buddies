import { useState } from 'react';
import { useRouter } from 'next/router';
import api from '../../services/api';

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
            return; // 条件を満たさない場合、APIリクエストを送信しない
        }
        // フォーム送信データをログに出力
        // console.log('Form Data:', formData);
        setLoading(true);
        try {
            // console.log('Sending API request to create user...');
            const response = await api.post('/auth/users/', formData);
            
            // 成功時のレスポンスをログに出力
            // console.log('Signup Response:', response.data);
            setMessage('User registered successfully. Please check your email to activate your account.');
        } catch (error) {
            // エラーレスポンスの詳細をログに出力
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
        <section className="vh-100" style={{ background: 'linear-gradient(to bottom, #000066 0%, #cc00cc 100%)' }}>
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col col-xl-10">
                        <div className="card" style={{ borderRadius: '1rem', backgroundColor: 'transparent', border: 'none' }}>
                            <div className="row g-0">
                                <div className="col-md-6 col-lg-5 d-none d-md-block">
                                    <img
                                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
                                        alt="signup form"
                                        className="img-fluid"
                                        style={{ borderRadius: '1rem 0 0 1rem' }}
                                    />
                                </div>
                                <div className="col-md-6 col-lg-7 d-flex align-items-center">
                                    <div className="card-body text-white">
                                        <form onSubmit={handleSubmit}>
                                            <div className="d-flex align-items-center pb-1">
                                                <img 
                                                    src='/images/logo.png' 
                                                    alt='logo' 
                                                    className='img-fluid'
                                                    width={200}
                                                />
                                            </div>
                                            <h5 className="fw-normal pb-3" style={{ letterSpacing: '1px' }}>Sign Up</h5>

                                            <div className="form-outline mb-4">
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className="form-control form-control-lg"
                                                    placeholder="Student Email (CWL@student.ubc.ca)"
                                                    style={{ color: 'white' }}
                                                    required
                                                />
                                            </div>

                                            <div className="form-outline mb-4">
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className="form-control form-control-lg"
                                                    placeholder="Your Name"
                                                    style={{ color: 'white' }}
                                                    required
                                                />
                                            </div>
                                            <div className="form-outline mb-4">
                                                <input
                                                    type="password"
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    className="form-control form-control-lg"
                                                    placeholder="Password"
                                                    style={{ color: 'white' }}
                                                    required
                                                />
                                            </div>

                                            <div className="form-outline mb-4">
                                                <input
                                                    type="password"
                                                    name="re_password"
                                                    value={formData.re_password}
                                                    onChange={handleChange}
                                                    className="form-control form-control-lg"
                                                    placeholder="Retype Password"
                                                    style={{ color: 'white' }}
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

                                            {message && <p className='text-success'>{message}</p>}

                                            <p className="mb-5 pb-lg-2 text-white" style={{ color: '#FFFFFF' }} onClick={handleLogin}>
                                                Already have an account? <a href="#!" style={{ color: '#FFFFFF' }}>Login here</a>
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