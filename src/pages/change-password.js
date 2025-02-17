import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { changePassword } from '../../services/api';
import styles from '../styles/ChangePassword.module.css'; // CSSモジュールをインポート

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

    const isValidPassword = (password) => {
        const forbiddenPatterns = [
            /--/, /;/, /'/, /"/, /\*/, /\bOR\b/i, /\bAND\b/i, /\bUNION\b/i, /\bSELECT\b/i, /\bINSERT\b/i, /\bDELETE\b/i, /\bUPDATE\b/i, /\bDROP\b/i
        ];
        return !forbiddenPatterns.some(pattern => pattern.test(password));
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isValidPassword(formData.current_password) || !isValidPassword(formData.new_password)) {
            setMessage('Invalid password format detected.');
            return;
        }

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
        <section className={styles['vh-100']}>
            <div className={`container ${styles['container-margin-top']}`}>
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col col-xl-10">
                        <div className={`card ${styles['transparent-card']}`}>
                            <div className="row g-0">
                                <div className="col-md-6 col-lg-7 d-flex align-items-center">
                                    <div className="card-body p-4 p-lg-5 text-white">
                                        <form onSubmit={handleSubmit}>

                                            <h5 className={`fw-normal mb-3 pb-3 ${styles['change-header']}`}>
                                                Change Your Password
                                            </h5>

                                            <div className="form-outline mb-4">
                                                <input
                                                    type="password"
                                                    name="current_password"
                                                    value={formData.current_password}
                                                    onChange={handleChange}
                                                    className={`form-control form-control-lg ${styles['input-white']}`}
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
                                                    className={`form-control form-control-lg ${styles['input-white']}`}
                                                    placeholder="New Password"
                                                    required
                                                />
                                            </div>

                                            <div className="pt-1 mb-4">
                                                {loading ?
                                                    <button
                                                        className={`btn btn-warning btn-lg btn-block ${styles['btn-large']}`}
                                                    >
                                                        Loading...
                                                    </button>
                                                :
                                                    <button
                                                        className={`btn btn-warning btn-lg btn-block ${styles['btn-large']}`}
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