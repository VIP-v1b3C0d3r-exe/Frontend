import { NavLink } from "react-router-dom";
import { useState } from "react";
import { FaHome, FaUserCircle, FaStar } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";

import logo from "../../assets/logo.svg";
import styles from "./Header.module.css";

const Header = ({ isLoggedIn, setIsLoggedIn }) => {
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setOpen(false);
  };

  const getNavLinkClass = ({ isActive }) => 
    isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink;

  return (
    <header className={styles.header}>
      <img src={logo} alt="logo" className={styles.logo} />

      <nav className={styles.nav}>
        <NavLink to="/" className={getNavLinkClass}>
          <FaHome />
          <span>home</span>
        </NavLink>

        {isLoggedIn ? (
          <>
            <NavLink to="/map" className={getNavLinkClass}>
              <MdLocationOn />
              <span>map</span>
            </NavLink>

            <NavLink to="/my-events" className={getNavLinkClass}>
              <FaStar />
              <span>saved</span>
            </NavLink>

            <div className={styles.profileWrapper}>
              <button
                type="button"
                className={styles.profileTrigger}
                onClick={() => setOpen(!open)}
              >
                <FaUserCircle />
                <span>Ilya Ivanov</span>
              </button>

              {open && (
                <div className={styles.dropdown}>
                  <button
                    type="button"
                    className={styles.dropdownItem}
                    onClick={handleLogout}
                  >
                    <FiLogOut />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <NavLink to="/login" className={getNavLinkClass}>
            <FaUserCircle />
            <span>guest</span>
          </NavLink>
        )}
      </nav>
    </header>
  );
};

export default Header;