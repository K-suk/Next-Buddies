import { useState } from 'react';
import Modal from 'react-modal';
import { updateProfile } from '../services/api';
import styles from '../src/styles/UpdateModal.module.css';  // CSSファイルをインポート

Modal.setAppElement('#__next');

export default function UpdateModal({ isOpen, onRequestClose, onProfileUpdate }) {
    const [formData, setFormData] = useState({
        sex: '',
        contact_address: '',
        age: '',
        bio: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.sex !== 'Male' && formData.sex !== 'Female') {
            setMessage('Please select a valid sex.');
            return;
        }

        const age = parseInt(formData.age, 10);
        if (isNaN(age) || age <= 0 || age > 100) {
            setMessage('Please enter a valid age.');
            return;
        }

        const usernamePattern = /^[A-Za-z0-9._]+$/;
        if (!usernamePattern.test(formData.contact_address)) {
            setMessage('Instagram username can only contain letters, numbers, dots, and underscores.');
            return;
        }
        setLoading(true);
        try {
            await updateProfile(formData);
            onProfileUpdate();
            onRequestClose();
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
            className={styles.modalContent}  // stylesを通してmodal-contentクラスを適用
        >
            <div className={styles.content}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className={`text-center ${styles.cardBox}`}>
                                <h2 className={styles.cardTitle}>We need this information for matching!</h2>
                                <form onSubmit={handleSubmit} className={`${styles.memberCard} pb-2`}>
                                    <div className={styles.formGroup}>
                                        <select
                                            name="sex"
                                            value={formData.sex}
                                            onChange={handleChange}
                                            required
                                            className={`${styles.formControlWhite} form-control`}
                                        >
                                            <option value="">Please choose your sex</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <input
                                            type="text"
                                            name="contact_address"
                                            value={formData.contact_address}
                                            onChange={handleChange}
                                            placeholder="Instagram"
                                            required
                                            className={`${styles.formControlWhite} form-control`}
                                            maxLength="50"
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <input
                                            type="number"
                                            name="age"
                                            value={formData.age}
                                            onChange={handleChange}
                                            placeholder="Age"
                                            required
                                            className={`${styles.formControlWhite} form-control`}
                                            maxLength="5"
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <textarea
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleChange}
                                            placeholder="Bio"
                                            className={`${styles.formControlWhite} form-control`}
                                            maxLength="250"
                                        />
                                    </div>
                                    {loading ?
                                        <button className={`${styles.btnLarge} btn btn-danger mt-3 btn-rounded waves-effect w-md waves-light`}>Loading...</button>
                                    :
                                        <button type="submit" className={`${styles.btnLarge} btn btn-danger mt-3 btn-rounded waves-effect w-md waves-light`}>Submit</button>
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