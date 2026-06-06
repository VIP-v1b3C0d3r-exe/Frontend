import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

import { FaHome, FaUserCircle, FaStar } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";

import { removeToken } from "../../utils/token";

import logo from "../../assets/logo.svg";
import styles from "./Header.module.css";

const Header = ({ isLoggedIn, setIsLoggedIn, profileImage, username }) => {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();

    setIsLoggedIn(false);

    setOpen(false);

    navigate("/login");
  };

  const getNavLinkClass = ({ isActive }) =>
    isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink;

  return (
    <header className={styles.header}>
      <div className={styles.mobileTopStrip} />

      <NavLink to="/" className={styles.logoLink}>
        <img src={logo} alt="logo" className={styles.logo} />
      </NavLink>

      <nav className={styles.nav}>
        <NavLink to="/" className={getNavLinkClass}>
          <FaHome />
          <span>home</span>
        </NavLink>

        {isLoggedIn && (
          <>
            <NavLink to="/map" className={getNavLinkClass}>
              <MdLocationOn />
              <span>map</span>
            </NavLink>

            <NavLink to="/my-events" className={getNavLinkClass}>
              <FaStar />
              <span>saved</span>
            </NavLink>
          </>
        )}

        {isLoggedIn ? (
          <div className={styles.profileWrapper}>
            <button
              type="button"
              className={styles.profileTrigger}
              onClick={() => setOpen((prev) => !prev)}
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="profile"
                  className={styles.profileImage}
                />
              ) : (
                <FaUserCircle />
              )}

              <span>{username || "user"}</span>
            </button>

            {open && (
              <div className={styles.dropdown}>
                <button
                  type="button"
                  className={styles.dropdownItem}
                  onClick={handleLogout}
                >
                  <FiLogOut />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
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
