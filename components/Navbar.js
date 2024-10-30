import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faProjectDiagram, faUser, faCog, faSignOutAlt, faThLarge, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import Dropdown from 'react-bootstrap/Dropdown';
import { getCurrentMatch, getProfile } from '../services/api';
import styles from '../src/styles/Navbar.module.css';  // CSSファイルをインポート

const Navbar = () => {
  const router = useRouter();
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [profile, setProfile] = useState(null);
  const [matchingStatue, setMatchingStatus] = useState('');

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
      if (url === '/profile', url === '/home') {
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
    <nav className={`${styles.navbar} p-0 fixed-top d-flex flex-row`}>
      <div className={`${styles.navbarBrandWrapper} d-flex d-lg-none align-items-center justify-content-center`}>
        <Link href={'/home'} legacyBehavior passHref>
          <a className={styles.navbar}>
            <img
              src="/images/logo.svg"
              alt="logo"
              className={styles.navbarLogo}
              width={100}
            />
          </a>
        </Link>
      </div>
      <div className={`${styles.navbarMenuWrapper} flex-grow d-flex align-items-stretch`}>
        <ul className={`${styles.navbarNav} ${styles.navbarNavRight}`}>
          <li className={`${styles.navItem} dropdown`}>
            <Dropdown>
              <Dropdown.Toggle as="a" className={styles.navLink}>
                <div className={styles.navbarProfile}>
                  <img
                    src={profile?.profile_image || "assets/images/faces/face15.jpg"}
                    alt="profile"
                    width={30}
                    height={30}
                    className={`${styles.imgXs} ${styles.roundedCircle}`}
                  />
                  <p className={`mb-0 d-none d-sm-block ${styles.navbarProfileName}`}>Menu</p>
                  <FontAwesomeIcon icon={faChevronDown} className="d-none d-sm-block" />
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu align="right" className={`${styles.dropdownMenu}`}>
                <Dropdown.Item className={`p-3 mb-0 ${styles.dropdownItem}`}>Menu</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item className={`dropdown-item ${styles.previewItem}`} onClick={handleProfile}>
                  <div className={styles.previewThumbnail}>
                    <div className={styles.previewIcon}>
                      <FontAwesomeIcon icon={faUser} className="text-success" />
                    </div>
                  </div>
                  <div className={styles.previewItemContent}>
                    <p className={`${styles.previewSubject} mb-1`}>Profile</p>
                  </div>
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item className={`dropdown-item ${styles.previewItem}`} onClick={handlePassChange}>
                  <div className={styles.previewThumbnail}>
                    <div className={styles.previewIcon}>
                      <FontAwesomeIcon icon={faCog} className="text-primary" />
                    </div>
                  </div>
                  <div className={styles.previewItemContent}>
                    <p className={`${styles.previewSubject} mb-1`}>Change<br />Password</p>
                  </div>
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item className={`dropdown-item ${styles.previewItem}`} onClick={handleLogout}>
                  <div className={styles.previewThumbnail}>
                    <div className={styles.previewIcon}>
                      <FontAwesomeIcon icon={faSignOutAlt} className="text-danger" />
                    </div>
                  </div>
                  <div className={styles.previewItemContent}>
                    <p className={`${styles.previewSubject} mb-1`}>Log out</p>
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