import { NavLink } from "react-router-dom";
import { useState } from "react";
import { FaHome, FaUserCircle, FaStar} from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";

import logo from "../../assets/logo.svg";
import "../../styles/header.css";

const Header = ({ isLoggedIn, setIsLoggedIn }) => {
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setOpen(false);
  };

  return (
    <header className="header">
      <img src={logo} alt="logo" className="header-logo" />

      <nav className="nav">
        <NavLink to="/">
          <FaHome />
          <span>home</span>
        </NavLink>

        {isLoggedIn ? (
          <>
            <NavLink to="/map">
              <MdLocationOn />
              <span>map</span>
            </NavLink>

            <NavLink to="/my-events">
              <FaStar />
              <span>saved</span>
            </NavLink>

            <div className="profile-wrapper">
              <button
                type="button"
                className="profile-trigger"
                onClick={() => setOpen(!open)}
              >
                <FaUserCircle />
                <span>Ilya Ivanov</span>
              </button>

              {open && (
                <div className="dropdown">

                  <button
                    type="button"
                    className="dropdown-item"
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
          <NavLink to="/login">
            <FaUserCircle />
            <span>guest</span>
          </NavLink>
        )}
      </nav>
    </header>
  );
};

export default Header;