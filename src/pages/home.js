import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getProfile, addMatching } from '../../services/api';
import UpdateModal from '../../components/UpdateModal';
import styles from '../styles/Home.module.css'; // CSSファイルをインポート

export default function Home() {
    const [name, setUsername] = useState('');
    const [sex, setSex] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [queueStatus, setQueueStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [need, setNeed] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const profile = await getProfile();
                setUsername(profile.name);
                setSex(profile.sex);

                if (profile.cur_matching) {
                    router.push('/current-match');
                } else if (profile.wait) {
                    router.push('/wait');
                } else if (profile.semi_comp) {
                    router.push('/semi-comp');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                if (error.response && error.response.status === 401) {
                    router.push('/login');
                } else {
                    setErrorMessage('Failed to load profile information. Please try again later.');
                }
            }
        };

        fetchUserData();
    }, [router]);

    const handleAddMatching = async (updatedSex = sex) => {
        setErrorMessage('');
        if (!need) {
            setErrorMessage('Please select a need for matching.');
            return;
        }

        if (!updatedSex) {
            setIsModalOpen(true);
            setErrorMessage('Please complete your profile to proceed with matching.');
            return;
        }

        setLoading(true);
        try {
            const response = await addMatching(need);
            setQueueStatus(response.status);
            if (response.status === 'Added to male queue, waiting for match' || response.status === 'Added to female queue, waiting for match') {
                router.push('/wait');
            } else if (response.status === 'Matched') {
                router.push('/current-match');
            } else {
                setErrorMessage('Unexpected response from server. Please try again.');
            }
        } catch (error) {
            console.error('Error starting matching:', error);
            setErrorMessage('Error starting matching. Please try again later.');
        }
        setLoading(false);
    };

    const handleProfileUpdate = async () => {
        try {
            const profile = await getProfile();
            setSex(profile.sex);
            setIsModalOpen(false);
            handleAddMatching(profile.sex);
        } catch (error) {
            console.error('Error updating profile:', error);
            setErrorMessage('Failed to update profile. Please try again.');
        }
    };

    return (
        <div className={`container ${styles['container-padding-top']}`}>
            <h1 className="text-center">Hi {name}! Click button for best drinking mate</h1>
            <img
                src="/images/BUDDIES.png"
                alt="login form"
                className={`img-fluid mx-auto d-block ${styles['centered-image']}`}
            />

            <div className={`text-center mb-3 ${styles['select-center']}`}>
                <label htmlFor="need">Select what you are looking for:</label>
                <select 
                    id="need" 
                    value={need} 
                    onChange={(e) => setNeed(e.target.value)} 
                    className="form-select"
                >
                    <option value="">-- Select --</option>
                    <option value="gym">Gym Buddy (Same gender)</option>
                    <option value="drink">Drinking Buddy (Same gender, 19+)</option>
                    <option value="party">Party Mate (Same gender)</option>
                    <option value="dating">Dating Partner (Different gender)</option>
                </select>
            </div>

            {errorMessage && <p className="alert alert-danger text-center">{errorMessage}</p>}

            {loading ?
                <button className={`btn btn-danger waves-effect w-md waves-light d-block mx-auto ${styles['btn-large']}`}>Loading...</button>
            :
                <button onClick={() => handleAddMatching()} className={`btn btn-danger waves-effect w-md waves-light d-block mx-auto ${styles['btn-large']}`}>Start Matching</button>
            }
            
            <UpdateModal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                onProfileUpdate={handleProfileUpdate}
            />
        </div>
    );
}
