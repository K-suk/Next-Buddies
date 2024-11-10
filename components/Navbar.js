import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faProjectDiagram, faUser, faCog, faSignOutAlt, faThLarge, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import Dropdown from 'react-bootstrap/Dropdown';
import { getCurrentMatch, getProfile } from '../services/api';
import styles from '../src/styles/Navbar.module.css';
import { useNonce } from '../context/NonceContext';  // useNonceをインポート

const Navbar = () => {
  const router = useRouter();
  const nonce = useNonce();  // nonceを取得
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [profile, setProfile] = useState(null);
  const [matchingStatus, setMatchingStatus] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getProfile();
        setProfile(profileData);
        setIsSuperuser(profileData.is_superuser);
      } catch (error) {
        console.error('Failed to fetch profile data', error);
      }
    };

    const handleRouteChange = (url) => {
      if (url === '/profile' || url === '/home') {
        fetchProfile();
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    router.push('/login');
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
    } catch (error) {
      console.error('Error processing matching:', error);
      setMatchingStatus('Error processing matching.');
    }
  };

  return (
    <nav className={`navbar p-0 fixed-top d-flex flex-row`}>
      <div className={`navbarBrandWrapper d-flex d-lg-none align-items-center justify-content-center`}>
        <Link href={'/home'} legacyBehavior passHref>
          <a className="navbar">
            <img
              src="/images/logo.svg"
              alt="logo"
              className={styles['navbarLogo']}
              width={100}
            />
          </a>
        </Link>
      </div>
      <div className={`navbarMenuWrapper flex-grow d-flex align-items-stretch`}>
        <ul className={`navbarNav ${styles['navbarNavRight']}`}>
          <li className={`navItem dropdown`}>
            <Dropdown>
              <Dropdown.Toggle as="a" className="navLink">
                <div className="navbarProfile">
                  <img
                    src={profile?.profile_image || "assets/images/faces/face15.jpg"}
                    alt="profile"
                    width={30}
                    height={30}
                    className={`imgXs roundedCircle`}
                  />
                  <p className={`mb-0 d-none d-sm-block navbarProfileName`}>Menu</p>
                  <FontAwesomeIcon icon={faChevronDown} className="d-none d-sm-block" />
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu align="right" className={`dropdownMenu`}>
                <Dropdown.Item className={`p-3 mb-0 dropdownItem`}>Menu</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item className={`dropdown-item previewItem`} onClick={handleProfile}>
                  <div className="previewThumbnail">
                    <div className="previewIcon">
                      <FontAwesomeIcon icon={faUser} className="text-success" />
                    </div>
                  </div>
                  <div className="previewItemContent">
                    <p className={`previewSubject mb-1`}>Profile</p>
                  </div>
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item className={`dropdown-item previewItem`} onClick={handlePassChange}>
                  <div className="previewThumbnail">
                    <div className="previewIcon">
                      <FontAwesomeIcon icon={faCog} className="text-primary" />
                    </div>
                  </div>
                  <div className="previewItemContent">
                    <p className={`previewSubject mb-1`}>Change<br />Password</p>
                  </div>
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item className={`dropdown-item previewItem`} onClick={handleLogout}>
                  <div className="previewThumbnail">
                    <div className="previewIcon">
                      <FontAwesomeIcon icon={faSignOutAlt} className="text-danger" />
                    </div>
                  </div>
                  <div className="previewItemContent">
                    <p className={`previewSubject mb-1`}>Log out</p>
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