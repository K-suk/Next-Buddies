import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getProfile, addToQueue } from '../../services/api';
import UpdateModal from '../../components/updateModal';

export default function Home() {
    const [name, setUsername] = useState('');
    const [sex, setSex] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [queueStatus, setQueueStatus] = useState('');
    const [loading, setLoading] = useState(false);
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

    const handleAddToQueue = async () => {
        setLoading(true);
        const profile = await getProfile();
        if (!profile.sex) {
            setIsModalOpen(true); // 性別が未入力の場合はモーダルを表示
            return;
        }
        setIsModalOpen(false);
        try {
            const response = await addToQueue();
            setQueueStatus(response.status);
            if (response.status === 'User added to queue') {
                router.push('/wait');
            }
        } catch (error) {
            console.error('Error adding to queue:', error);
            setQueueStatus('Error adding to queue.');
        }
        setLoading(false);
    };

    const handleProfileUpdate = () => {
        setSex('Updated'); // モーダルでのプロファイル更新後に性別を更新
        handleAddToQueue(); // モーダルを閉じた後に再度キューに追加を試みる
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
            {loading ?
                <button className="btn btn-danger waves-effect w-md waves-light d-block mx-auto fw-bold" style={{ padding: '20px 60px', fontSize: '24px', borderRadius: '10px' }}>Loading...</button>
            :
                <button onClick={handleAddToQueue} className="btn btn-danger waves-effect w-md waves-light d-block mx-auto fw-bold" style={{ padding: '20px 60px', fontSize: '24px', borderRadius: '10px' }}>Start Matching</button>
            }
            <UpdateModal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                onProfileUpdate={handleAddToQueue} // プロファイル更新時の処理を指定
            />
        </div>
    );
}