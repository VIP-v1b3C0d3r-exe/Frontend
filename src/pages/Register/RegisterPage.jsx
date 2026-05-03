import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";

import "../../styles/Login.css";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);

  const handleRegister = (event) => {
    event.preventDefault();
    navigate("/login");
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="avatar-upload">
          <label htmlFor="avatar-input" className="avatar-wrapper">
            {image ? (
              <img src={image} alt="avatar" className="avatar-img" />
            ) : (
              <FaUserCircle className="avatar-icon" />
            )}

            <span className="avatar-tooltip">Upload photo</span>
          </label>

          <input
            id="avatar-input"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            hidden
          />
        </div>

        <form className="login-form" onSubmit={handleRegister}>
          <input type="text" placeholder="Username" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />

          <button type="submit">Sign up</button>
        </form>

        <p className="login-bottom-text">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </section>
    </main>
  );
};

export default RegisterPage;