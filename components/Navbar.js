import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCog, faSignOutAlt, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import Dropdown from 'react-bootstrap/Dropdown';
import { getProfile } from '../services/api';
import { useNonce } from '../context/NonceContext';
import styles from '../src/styles/Navbar.module.css';

const Navbar = () => {
  const router = useRouter();
  const nonce = useNonce();
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

    router.events.on('routeChangeComplete', (url) => {
      if (url === '/profile' || url === '/home') fetchProfile();
    });

    return () => {
      router.events.off('routeChangeComplete', (url) => {
        if (url === '/profile' || url === '/home') fetchProfile();
      });
    };
  }, [router.events]);

  return (
    <nav className="navbar p-0 fixed-top d-flex flex-row">
      <div className="navbarBrandWrapper d-flex d-lg-none align-items-center justify-content-center">
        <Link href={'/home'} legacyBehavior passHref>
          <a className="navbar">
            <img
              src="/images/logo.svg"
              alt="logo"
              className={`${styles['navbarLogo']}`}
              width={100}
            />
          </a>
        </Link>
      </div>
      <div className="navbarMenuWrapper flex-grow d-flex align-items-stretch">
        <ul className={`navbarNav ${style['navbarNavRight']}`}>
          <li className="navItem dropdown">
            <Dropdown>
              <Dropdown.Toggle as="a" className="navLink">
                <div className="navbarProfile">
                  <img
                    src={profile?.profile_image || "assets/images/faces/face15.jpg"}
                    alt="profile"
                    width={30}
                    height={30}
                    className="imgXs roundedCircle"
                  />
                  <p className="mb-0 d-none d-sm-block navbarProfileName">Menu</p>
                  <FontAwesomeIcon icon={faChevronDown} className="d-none d-sm-block" />
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu align="right" className="dropdownMenu">
                <Dropdown.Item className="p-3 mb-0 dropdownItem">Menu</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item className="dropdown-item previewItem" onClick={() => router.push('/profile')}>
                  <FontAwesomeIcon icon={faUser} className="text-success" />
                  Profile
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item className="dropdown-item previewItem" onClick={() => router.push('/change-password')}>
                  <FontAwesomeIcon icon={faCog} className="text-primary" />
                  Change Password
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item className="dropdown-item previewItem" onClick={() => {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    router.push('/login');
                }}>
                  <FontAwesomeIcon icon={faSignOutAlt} className="text-danger" />
                  Log out
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