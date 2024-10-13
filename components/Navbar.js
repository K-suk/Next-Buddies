import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faProjectDiagram, faUser, faCog, faSignOutAlt, faThLarge, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import Dropdown from 'react-bootstrap/Dropdown';
import { getCurrentMatch, getProfile } from '../services/api'; // getProfileをインポート

const Navbar = () => {
  const router = useRouter();
  const [isSuperuser, setIsSuperuser] = useState(false); // is_superuserステータスを管理するstate
  const [profile, setProfile] = useState(null); // 初期状態はnull
  const [matchingStatue, setMatchingStatus] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getProfile(); // ユーザープロファイルを取得
        setProfile(profileData); // プロフィールデータをセット
        setIsSuperuser(profileData.is_superuser);
      } catch (error) {
        console.error('Failed to fetch profile data', error);
      }
    };

    // ページ遷移のたびにプロフィールを再取得
    const handleRouteChange = (url) => {
      if (url === '/profile', url === '/home') {
        fetchProfile(); // プロフィールページに遷移した際に再取得
      }
    };

    // ルート変更時にイベントリスナーを追加
    router.events.on('routeChangeComplete', handleRouteChange);

    // クリーンアップ：イベントリスナーを解除
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]); // ルート変更時に再実行

  const handleLogout = () => {
    localStorage.removeItem('accessToken'); // ログアウト時にアクセストークンを削除
    localStorage.removeItem('refreshToken');
    router.push('/login'); // ログアウト後、ログインページにリダイレクト
  };

  const handleProfile = () => {
    router.push('/profile');
  };

  const handlePassChange = () => {
    router.push('/change-password');
  };

  const handleProcessMatching = async () => {
    try {
      const response = await processMatching();
      setMatchingStatus(response.status);
      // const matchData = await getCurrentMatch(); // マッチング後に相手がいるかを確認
      // if (matchData) {
      //   router.push('/current-match'); // マッチング成功後、current-match.jsにリダイレクト
      // }
    } catch (error) {
      console.error('Error processing matching:', error);
      setMatchingStatus('Error processing matching.');
    }
  };

  return (
    <nav className="navbar p-0 fixed-top d-flex flex-row">
      <div className="navbar-brand-wrapper d-flex d-lg-none align-items-center justify-content-center">
        <Link href={'/home'} legacyBehavior passHref>
          <a className="navbar">
            {/* プロフィールデータが取得されていない場合はデフォルト画像を表示 */}
            <img
              src="/images/logo.svg"
              alt="logo"
              style={{marginLeft: '75px'}}
              width={100}
            />
          </a>
        </Link>
      </div>
      <div className="navbar-menu-wrapper flex-grow d-flex align-items-stretch">
        <ul className="navbar-nav navbar-nav-right" style={{ marginLeft: 'auto' }}>
          {/* is_superuser が true の場合のみ Match ボタンを表示 */}
          {/* {isSuperuser && (
            <li>
              <button onClick={handleProcessMatching} className="btn btn-success waves-effect w-md waves-light d-block mx-auto fw-bold" style={{ padding: '', fontSize: '18px', borderRadius: '5px' }}>
                Match
              </button>
            </li>
          )} */}
          <li className="nav-item dropdown">
            <Dropdown>
              <Dropdown.Toggle as="a" className="nav-link count-indicator">
                <div className="navbar-profile">
                  {/* プロフィールデータが取得されていない場合はデフォルト画像を表示 */}
                  <img
                    src={profile?.profile_image || "assets/images/faces/face15.jpg"}
                    alt="profile"
                    width={30}
                    height={30}
                    className="img-xs rounded-circle"
                  />
                  <p className="mb-0 d-none d-sm-block navbar-profile-name">Menu</p>
                  <FontAwesomeIcon icon={faChevronDown} className="d-none d-sm-block" />
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu align="right" className="dropdown-menu dropdown-menu-right navbar-dropdown preview-list">
                <Dropdown.Item className="p-3 mb-0">Menu</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item className="dropdown-item preview-item" onClick={handleProfile}>
                  <div className="preview-thumbnail">
                    <div className="preview-icon">
                      <FontAwesomeIcon icon={faUser} className="text-success" />
                    </div>
                  </div>
                  <div className="preview-item-content">
                    <p className="preview-subject mb-1">Profile</p>
                  </div>
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item className="dropdown-item preview-item" onClick={handlePassChange}>
                  <div className="preview-thumbnail">
                    <div className="preview-icon">
                      <FontAwesomeIcon icon={faCog} className="text-primary" />
                    </div>
                  </div>
                  <div className="preview-item-content">
                    <p className="preview-subject mb-1">Change<br />Password</p>
                  </div>
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item className="dropdown-item preview-item" onClick={handleLogout}>
                  <div className="preview-thumbnail">
                    <div className="preview-icon">
                      <FontAwesomeIcon icon={faSignOutAlt} className="text-danger" />
                    </div>
                  </div>
                  <div className="preview-item-content">
                    <p className="preview-subject mb-1">Log out</p>
                  </div>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;