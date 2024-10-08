import { useState } from 'react';
import Modal from 'react-modal'; // モーダル表示に使用するライブラリ
import { submitReview } from '../services/api';

// モーダルのスタイルを定義
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

export default function ReviewModal({ isOpen, onRequestClose, onReviewSubmit }) {
    const [rating, setRating] = useState(0);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false); // Loading状態を追加

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // console.log('Submitting rating:', rating); // ここでratingが正しく表示されるか確認
            const newAverageRating = await submitReview(rating);
            onReviewSubmit(newAverageRating);
            // onRequestClose(); // モーダルを閉じる部分を一時的にコメントアウト
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
            style={customStyles} // モーダルのスタイルを適用
        >
            <h2 className='text-dark'>Submit Review</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label className='text-dark' style={{ fontSize: '24px', marginRight: '10px' }}>Rating:</label>
                    {/* <input
                        type="number"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        min="1"
                        max="5"
                        style={{ width: '50px' }}
                        required
                    /> */}
                    <select className='custom-select mb-3' 
                        id="inputGroupSelect01" 
                        value={rating}
                        onChange={(e) => setRating(e.target.value)} 
                        required>
                        <option selected>Choose...</option>
                        <option value="5">5</option>
                        <option value="4">4</option>
                        <option value="3">3</option>
                        <option value="2">2</option>
                        <option value="1">1</option>
                    </select>
                </div>
                {loading?
                    <button className='btn btn-danger mb-3' style={{ fontSize: '24px', borderRadius: '5px' }}>Loading...</button>
                :
                    <button type="submit" className='btn btn-danger mb-3' style={{ fontSize: '24px', borderRadius: '5px' }}>Submit Review</button>
                }
                {message && <p>{message}</p>}
            </form>
            <button onClick={onRequestClose} className='btn' style={{ fontSize: '24px', borderRadius: '5px', color: 'black' }}>×</button>
        </Modal>
    );
}