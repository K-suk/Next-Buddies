import { useState } from 'react';
import Modal from 'react-modal';
import { updateProfile } from '../services/api';
import styles from '../src/styles/UpdateModal.module.css';

Modal.setAppElement('#__next');

export default function UpdateModal({ isOpen, onRequestClose, onProfileUpdate }) {
    const [formData, setFormData] = useState({
        sex: '',
        contact_address: '',
        age: '',
        bio: '',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

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
            setMessage('Failed to update profile. Please try again.');
        }
        setLoading(false);
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Submit Update"
            className={styles.modalContent}
            overlayClassName={styles.modalOverlay}
        >
            <div className={styles.container}>
                <h2 className={styles.cardTitle}>We need this information for matching!</h2>
                <form onSubmit={handleSubmit} className={styles.memberCard}>
                    <div className={styles.formGroup}>
                        <select
                            name="sex"
                            value={formData.sex}
                            onChange={handleChange}
                            required
                            className={`${styles.formControl} form-control`}
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
                            className={`${styles.formControl} form-control`}
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
                            className={`${styles.formControl} form-control`}
                            maxLength="5"
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder="Bio"
                            className={`${styles.formControl} form-control`}
                            maxLength="250"
                        />
                    </div>
                    {loading ? (
                        <button className={`${styles.btnLarge} btn btn-danger mt-3`}>
                            Loading...
                        </button>
                    ) : (
                        <button type="submit" className={`${styles.btnLarge} btn btn-danger mt-3`}>
                            Submit
                        </button>
                    )}
                    {message && <p className="alert alert-info mt-3">{message}</p>}
                </form>
            </div>
        </Modal>
    );
}