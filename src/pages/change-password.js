import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { changePassword } from '../../services/api'; // services/api.js から changePassword 関数をインポート

export default function ChangePassword() {
    const [formData, setFormData] = useState({
        current_password: '',
        new_password: '',
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false); // Loading状態を追加
    const router = useRouter();

    useEffect(() => {
        // ログインしていない場合はリダイレクト
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
        <section className="vh-100" style={{ background: 'linear-gradient(to bottom, #000066 0%, #cc00cc 100%);' }}>
            <div className="container" style={{ marginTop: '130px' }}>
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col col-xl-10">
                        <div className="card" style={{ backgroundColor: 'transparent', border: 'none'}}>
                            <div className="row g-0">
                                <div className="col-md-6 col-lg-7 d-flex align-items-center">
                                    <div className="card-body p-4 p-lg-5 text-white">
                                        <form onSubmit={handleSubmit}>

                                            <h5 className="fw-normal mb-3 pb-3" style={{ letterSpacing: '1px' }}>
                                                Change Your Password
                                            </h5>

                                            <div className="form-outline mb-4">
                                                <input
                                                    type="password"
                                                    id="form2Example17"
                                                    name="current_password"
                                                    value={formData.current_password}
                                                    onChange={handleChange}
                                                    className="form-control form-control-lg"
                                                    placeholder="Current Password"
                                                    style={{ color: 'white' }}
                                                    required
                                                />
                                            </div>

                                            <div className="form-outline mb-4">
                                                <input
                                                    type="password"
                                                    id="form2Example27"
                                                    name="new_password"
                                                    value={formData.new_password}
                                                    onChange={handleChange}
                                                    className="form-control form-control-lg"
                                                    placeholder="New Password"
                                                    style={{ color: 'white' }}
                                                    required
                                                />
                                            </div>

                                            <div className="pt-1 mb-4">
                                                {loading?
                                                    <button
                                                        className="btn btn-warning btn-lg btn-block"
                                                    >
                                                        Loading...
                                                    </button>
                                                :
                                                    <button
                                                        className="btn btn-warning btn-lg btn-block"
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