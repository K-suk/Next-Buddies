import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCog, faSignOutAlt, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import Dropdown from 'react-bootstrap/Dropdown';
import { getProfile } from '../services/api';
import styles from '../src/styles/Navbar.module.css';

const Navbar = () => {
  const router = useRouter();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getProfile();
        setProfile(profileData);
      } catch (error) {
        console.error('Failed to fetch profile data', error);
      }
    };

    const handleRouteChange = (url) => {
      if (url === '/profile' || url === '/home') fetchProfile();
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

  return (
    <nav className={`navbar navbar-expand-lg ${styles.navbar} fixed-top`}>
      <div className={`navbar-brand-wrapper ${styles.navbarBrandWrapper} d-flex d-lg-none align-items-center justify-content-center`}>
        <Link href={'/home'} legacyBehavior passHref>
          <a className="navbar">
            <img
              src="/images/logo.svg"
              alt="logo"
              className={styles.navbarLogo}
              width={100}
            />
          </a>
        </Link>
      </div>
      <div className={`navbar-menu-wrapper ${styles.navbarMenuWrapper} d-flex align-items-stretch`}>
        <ul className={`navbar-nav ${styles['navbar-nav-right']}`}>
          <li className="nav-item dropdown">
            <Dropdown>
              <Dropdown.Toggle as="a" className={`nav-link ${styles.navLink}`}>
                <div className={styles.navbarProfile}>
                  <img
                    src={profile?.profile_image || "assets/images/faces/face15.jpg"}
                    alt="profile"
                    width={30}
                    height={30}
                    className={`${styles['img-xs']} rounded-circle`}
                  />
                  <p className={`mb-0 d-none d-sm-block ${styles.navbarProfileName}`}>Menu</p>
                  <FontAwesomeIcon icon={faChevronDown} className="d-none d-sm-block" />
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu align="right" className={`dropdown-menu ${styles.dropdownMenu}`}>
                <Dropdown.Item className={`dropdown-item ${styles.dropdownItem}`} onClick={() => router.push('/profile')}>
                  <FontAwesomeIcon icon={faUser} className="text-success " />
                  <span className="ml-2 ms-2">Profile</span>
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item className={`dropdown-item ${styles.dropdownItem}`} onClick={() => router.push('/change-password')}>
                  <FontAwesomeIcon icon={faCog} className="text-primary" />
                  <span className="ml-2 ms-2">Change Password</span>
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item className={`dropdown-item ${styles.dropdownItem}`} onClick={handleLogout}>
                  <FontAwesomeIcon icon={faSignOutAlt} className="text-danger" />
                  <span className="ml-2 ms-2">Log out</span>
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
