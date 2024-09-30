import Image from 'next/image';
import { useState } from 'react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={`sidebar sidebar-offcanvas ${isOpen ? 'active' : ''}`} id="sidebar">
      <div className="sidebar-brand-wrapper d-none d-lg-flex align-items-center justify-content-center fixed-top">
        <a className="sidebar-brand brand-logo" href="index.html">
          <Image src="/assets/images/logo.svg" alt="logo" width={100} height={40} />
        </a>
        <a className="sidebar-brand brand-logo-mini" href="index.html">
          <Image src="/assets/images/logo-mini.svg" alt="logo" width={50} height={40} />
        </a>
      </div>
      <ul className="nav">
        {/* Profile and other items */}
        <li className="nav-item nav-category">
          <span className="nav-link text-white">Navigation</span>
        </li>
        {/* More items */}
      </ul>
      <button onClick={toggleSidebar}>Toggle Sidebar</button>
    </nav>
  );
};

export default Sidebar;