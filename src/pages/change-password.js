import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { changePassword } from '../../services/api';
import '../styles/ChangePassword.css';  // CSSファイルをインポート

export default function ChangePassword() {
    const [formData, setFormData] = useState({
        current_password: '',
        new_password: '',
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            router.push('/login');
        }
    }, [router]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordPattern.test(formData.new_password)) {
            setMessage('New password must be at least 8 characters, include an uppercase letter, and a number.');
            return;
        }

        if (formData.current_password === formData.new_password) {
            setMessage('New password cannot be the same as the current password.');
            return;
        }

        setLoading(true);
        try {
            await changePassword(formData.current_password, formData.new_password);
            setMessage('Password changed successfully.');
            setFormData({
                current_password: '',
                new_password: '',
            });
        } catch (error) {
            console.error('Change Password Error:', error.response ? error.response.data : error.message);
            setMessage('Failed to change password. Please try again.');
        }
        setLoading(false);
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

                                            <h5 className="fw-normal mb-3 pb-3 change-header">
                                                Change Your Password
                                            </h5>

                                            <div className="form-outline mb-4">
                                                <input
                                                    type="password"
                                                    name="current_password"
                                                    value={formData.current_password}
                                                    onChange={handleChange}
                                                    className="form-control form-control-lg input-white"
                                                    placeholder="Current Password"
                                                    required
                                                />
                                            </div>

                                            <div className="form-outline mb-4">
                                                <input
                                                    type="password"
                                                    name="new_password"
                                                    value={formData.new_password}
                                                    onChange={handleChange}
                                                    className="form-control form-control-lg input-white"
                                                    placeholder="New Password"
                                                    required
                                                />
                                            </div>

                                            <div className="pt-1 mb-4">
                                                {loading ?
                                                    <button
                                                        className="btn btn-warning btn-lg btn-block btn-large"
                                                    >
                                                        Loading...
                                                    </button>
                                                :
                                                    <button
                                                        className="btn btn-warning btn-lg btn-block btn-large"
                                                        type="submit"
                                                    >
                                                        Change Password
                                                    </button>
                                                }
                                            </div>

                                            {message && <p>{message}</p>}
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