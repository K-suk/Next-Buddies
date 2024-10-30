import { useState } from 'react';
import Modal from 'react-modal';
import { submitReview } from '../services/api';
import styles from '../src/styles/ReviewModal.module.css';

Modal.setAppElement('#__next');

export default function ReviewModal({ isOpen, onRequestClose, onReviewSubmit }) {
    const [rating, setRating] = useState(0);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating < 1 || rating > 5) {
            setMessage('Please select a valid rating between 1 and 5.');
            return;
        }
        setLoading(true);
        try {
            const newAverageRating = await submitReview(rating);
            onReviewSubmit(newAverageRating);
        } catch (error) {
            console.error('Error submitting review:', error);
        }
        setLoading(false);
    };    

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Submit Review"
            className={styles.modal-content}  // モジュールCSSを使用
        >
            <h2 className={styles.text-dark}>Submit Review</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label className={styles.text-dark}>Rating:</label>
                    <select className={`${styles.custom-select} mb-3`} 
                        id="inputGroupSelect01" 
                        value={rating}
                        onChange={(e) => setRating(e.target.value)} 
                        required>
                        <option value="">Choose...</option>
                        <option value="5">5</option>
                        <option value="4">4</option>
                        <option value="3">3</option>
                        <option value="2">2</option>
                        <option value="1">1</option>
                    </select>
                </div>
                {loading?
                    <button className={`${styles.btn-large} btn btn-danger mb-3`}>Loading...</button>
                :
                    <button type="submit" className={`${styles.btn-large} btn btn-danger mb-3`}>Submit Review</button>
                }
                {message && <p>{message}</p>}
            </form>
            <button onClick={onRequestClose} className={`${styles.btn-large} btn`}>×</button>
        </Modal>
    );
}