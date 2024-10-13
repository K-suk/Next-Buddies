import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getProfile, addMatching } from '../../services/api';
import UpdateModal from '../../components/UpdateModal';

export default function Home() {
    const [name, setUsername] = useState('');
    const [sex, setSex] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [queueStatus, setQueueStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [need, setNeed] = useState(''); // need（ユーザーの希望するマッチングの種類）
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const profile = await getProfile(); // ユーザー情報を取得
                setUsername(profile.name);
                setSex(profile.sex);

                // ユーザーがマッチング中かどうかをチェック
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
                }
            }
        };

        fetchUserData();
    }, [router]);

    // マッチング処理
    const handleAddMatching = async () => {
        if (!need) {
            alert('Please select a need for matching.');
            return;
        }

        setLoading(true);
        try {
            const response = await addMatching(need); // needを指定してマッチング開始
            setQueueStatus(response.status);
            if (response.status === 'Added to male queue, waiting for match' || response.status === 'Added to female queue, waiting for match') {
                router.push('/wait');
            } else if (response.status === 'Matched') {
                router.push('/current-match');
            }
        } catch (error) {
            console.error('Error starting matching:', error);
            setQueueStatus('Error starting matching.');
        }
        setLoading(false);
    };

    return (
        <div className='container' style={{ paddingTop: '100px' }}>
            <h1 className='text-center'>Hi {name}! Click button for best drinking mate</h1>
            <img
                src="/images/BUDDIES.png"
                alt="login form"
                className="img-fluid mx-auto d-block"
                style={{ borderRadius: '1rem 0 0 1rem', border: 'none' }}
            />

            <div className="text-center mb-3">
                <label htmlFor="need">Select what you are looking for:</label>
                <select 
                    id="need" 
                    value={need} 
                    onChange={(e) => setNeed(e.target.value)} 
                    className="form-select"
                    style={{ width: '75%', height: '60px', margin: '0 auto' }}
                >
                    <option value="">-- Select --</option>
                    <option value="friend">New Friend (With same Gender)</option>
                    <option value="gym">Gym Buddy (With same Gender)</option>
                    <option value="drink">Drinking Buddy (With same Gender & 19+)</option>
                    <option value="party">Party Mate (With same Gender)</option>
                    <option value="dating">Dating Partner (With different Gender)</option>
                </select>
            </div>

            {loading ?
                <button className="btn btn-danger waves-effect w-md waves-light d-block mx-auto fw-bold" style={{ padding: '20px 60px', fontSize: '24px', borderRadius: '10px' }}>Loading...</button>
            :
                <button onClick={handleAddMatching} className="btn btn-danger waves-effect w-md waves-light d-block mx-auto fw-bold" style={{ padding: '20px 60px', fontSize: '24px', borderRadius: '10px' }}>Start Matching</button>
            }

            <UpdateModal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                onProfileUpdate={handleAddMatching} // プロファイル更新時の処理を指定
            />
        </div>
    );
}