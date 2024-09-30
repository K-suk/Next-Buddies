// pages/wait.js
import { useRouter } from 'next/router';
import { getProfile } from '../../services/api';
import { useEffect } from 'react';

export default function Wait() {
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                console.log('Fetching user data...');
                const profile = await getProfile(); // getProfile を使用してユーザー情報を取得
                console.log('User data received:', profile);

                // ユーザーがマッチング中かどうかをチェック
                if (profile.cur_matching) {
                    router.push('/current-match'); // マッチング相手がいる場合、current-match.jsにリダイレクト
                } else if (profile.wait) {
                    router.push('/wait'); // 待機中の場合、wait.jsにリダイレクト
                } else if (profile.semi_comp) {  // semi_comp が true ならば、/semi-comp にリダイレクト
                    router.push('/semi-comp');
                } else {
                    router.push('/home')
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                if (error.response && error.response.status === 401) {
                    console.error('Unauthorized. Redirecting to login.');
                    router.push('/login'); // 認証エラーが発生した場合、ログインページにリダイレクト
                }
            }
        };

        fetchUserData();
    }, []);


    return (
        <div className='container' style={{ paddingTop: '100px' }}>
            <img
                src="/images/BUDDIES.png"
                alt="login form"
                className="img-fluid mx-auto d-block"
                style={{ borderRadius: '1rem 0 0 1rem', border: 'none' }}
            />
            <h1 className='text-center'>Please wait for your buddy to finish the matching</h1>
        </div>
    );
}