import { useState } from 'react';
import Modal from 'react-modal'; // モーダル表示に使用するライブラリ
import { updateProfile } from '../services/api';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: '10px',
        width: '80%',
    },
};

Modal.setAppElement('#__next'); // アプリケーションのルート要素を指定

export default function UpdateModal({ isOpen, onRequestClose, onProfileUpdate }) {
    const [formData, setFormData] = useState({
        sex: '',
        contact_address: '',
        age: '',
        bio: '',
    });
    const [loading, setLoading] = useState(false); // Loading状態を追加

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // ページのリロードを防ぐ
        setLoading(true);
        try {
            await updateProfile(formData); // APIを使ってプロフィールを更新
            onProfileUpdate(); // プロフィール更新後に外部関数を呼び出す（正しい関数名に修正）
            onRequestClose(); // モーダルを閉じる
        } catch (error) {
            console.error('Profile Update Error:', error);
        }
        setLoading(false);
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Submit Update"
            style={customStyles}
        >
            <div className="content">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="text-center card-box">
                                <h2 style={{ color: 'black' }}>We need this information for matching!</h2>
                                <form onSubmit={handleSubmit} className="member-card pb-2">
                                    <div className="form-group">
                                        <select
                                            name="sex"
                                            value={formData.sex}
                                            onChange={handleChange}
                                            required
                                            className="form-control"
                                            style={{ color: 'white' }}
                                        >
                                            <option value="">Please choose your sex</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            name="contact_address"
                                            value={formData.contact_address}
                                            onChange={handleChange}
                                            placeholder="Instagram"
                                            required
                                            className="form-control"
                                            style={{ color: 'white' }}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <input
                                            type="number"
                                            name="age"
                                            value={formData.age}
                                            onChange={handleChange}
                                            placeholder="Age"
                                            required
                                            className="form-control"
                                            style={{ color: 'white' }}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <textarea
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleChange}
                                            placeholder="Bio"
                                            className="form-control"
                                            style={{ color: 'white' }}
                                        />
                                    </div>
                                    {loading ?
                                        <button className="btn btn-danger mt-3 btn-rounded waves-effect w-md waves-light" style={{ padding: '20px 60px', fontSize: '24px' }}>Loading...</button>
                                    :
                                        <button type="submit" className="btn btn-danger mt-3 btn-rounded waves-effect w-md waves-light" style={{ padding: '20px 60px', fontSize: '24px' }}>Submit</button>
                                    }
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}