import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getProfile, addMatching } from '../../services/api';
import UpdateModal from '../../components/UpdateModal';

export default function Home() {
    const [name, setUsername] = useState('');
    const [sex, setSex] = useState('');  // 性別
    const [isModalOpen, setIsModalOpen] = useState(false);  // モーダルの表示状態
    const [queueStatus, setQueueStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [need, setNeed] = useState(''); // need（ユーザーの希望するマッチングの種類）
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const profile = await getProfile(); // ユーザー情報を取得
                setUsername(profile.name);
                setSex(profile.sex); // 性別を設定

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
    const handleAddMatching = async (updatedSex = sex) => {
        if (!need) {
            alert('Please select a need for matching.');
            return;
        }

        // 性別が設定されていない場合、モーダルを表示してユーザーに更新を促す
        if (!updatedSex) {
            setIsModalOpen(true);
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

    // 性別が未設定の際に呼び出されるプロファイル更新処理
    const handleProfileUpdate = async () => {
        try {
            const profile = await getProfile();
            setSex(profile.sex); // 更新された性別を取得して設定
            setIsModalOpen(false); // モーダルを閉じる

            // 性別がしっかり更新されているため、そのままマッチングを続ける
            handleAddMatching(profile.sex);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
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

            {/* Central alignment for select */}
            <div className="text-center mb-3" style={{ width: '100%', textAlign: 'center' }}>
                <label htmlFor="need">Select what you are looking for:</label>
                <select 
                    id="need" 
                    value={need} 
                    onChange={(e) => setNeed(e.target.value)} 
                    className="form-select"
                    style={{ width: '75%', height: '60px', margin: '0 auto' }} // セレクトボックスを中央寄せ
                >
                    <option value="">-- Select --</option>
                    <option value="gym">Gym Buddy (Same gender)</option>
                    <option value="drink">Drinking Buddy (Same gender, 19+)</option>
                    <option value="party">Party Mate (Same gender)</option>
                    <option value="dating">Dating Partner (Different gender)</option>
                </select>
            </div>

            {loading ?
                <button className="btn btn-danger waves-effect w-md waves-light d-block mx-auto fw-bold" style={{ padding: '20px 60px', fontSize: '24px', borderRadius: '10px' }}>Loading...</button>
            :
                <button onClick={() => handleAddMatching()} className="btn btn-danger waves-effect w-md waves-light d-block mx-auto fw-bold" style={{ padding: '20px 60px', fontSize: '24px', borderRadius: '10px' }}>Start Matching</button>
            }

            <UpdateModal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                onProfileUpdate={handleProfileUpdate} // プロファイル更新時の処理を指定
            />
        </div>
    );
}