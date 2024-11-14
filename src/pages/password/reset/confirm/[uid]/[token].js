import { useState } from 'react';
import api from '../../../../../../services/api';
import { useRouter } from 'next/router';
import styles from '../../../../../styles/PasswordResetConfirm.module.css';  // CSSファイルをインポート

export default function PasswordResetConfirm() {
    const [formData, setFormData] = useState({
        uid: '',
        token: '',
        new_password: '',
        re_new_password: '',
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        const { uid, token } = router.query;

        api.post(`/auth/users/reset_password_confirm/`, {
            uid: uid,
            token: token,
            new_password: formData.new_password,
            re_new_password: formData.re_new_password,
        })
        .then(response => {
            setMessage('Password reset successfully. You can now log in with your new password.');
            router.push('/login');
        })
        .catch(error => {
            console.error('Password Reset Confirm Error:', error.response.data);
            setMessage('Failed to reset password. Please try again.');
        });
        setLoading(false);
    };

    return (
        <section className={styles['vh-100']}>
            <div className={`container`}>
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col col-xl-10">
                        <div className={`card ${styles['transparent-card']}`}>
                            <div className="row g-0">
                                <div className="col-md-6 col-lg-7 d-flex align-items-center">
                                    <div className="card-body p-4 p-lg-5 text-white">
                                        <form onSubmit={handleSubmit}>

                                            <h5 className={`fw-normal mb-3 pb-3 ${styles['reset-header']}`}>
                                                Reset Your Password
                                            </h5>

                                            <div className="form-outline mb-4">
                                                <input
                                                    type="password"
                                                    id="form2Example17"
                                                    name="new_password"
                                                    value={formData.new_password}
                                                    onChange={handleChange}
                                                    className={`form-control form-control-lg ${styles['input-white']}`}
                                                    placeholder="Enter new password"
                                                    required
                                                />
                                            </div>

                                            <div className="form-outline mb-4">
                                                <input
                                                    type="password"
                                                    id="form2Example27"
                                                    name="re_new_password"
                                                    value={formData.re_new_password}
                                                    onChange={handleChange}
                                                    className={`form-control form-control-lg ${styles['input-white']}`}
                                                    placeholder="Confirm new password"
                                                    required
                                                />
                                            </div>

                                            <div className="pt-1 mb-4">
                                                {loading ?
                                                    <button
                                                        className={`btn btn-success btn-lg btn-block ${styles['btn-large']}`}
                                                    >
                                                        Loading...
                                                    </button>
                                                :
                                                    <button
                                                        className={`btn btn-success btn-lg btn-block ${styles['btn-large']}`}
                                                        type="submit"
                                                    >
                                                        Reset Password
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