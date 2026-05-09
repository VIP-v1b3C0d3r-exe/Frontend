import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";

import styles from "./RegisterPage.module.css";

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
    <main className={styles.registerPage}>
      <section className={styles.card}>
        <div className={styles.avatarUpload}>
          <label htmlFor="avatar-input" className={styles.avatarWrapper}>
            {image ? (
              <img src={image} alt="avatar" className={styles.avatarImg} />
            ) : (
              <FaUserCircle className={styles.avatarIcon} />
            )}
            <span className={styles.avatarTooltip}>Upload photo</span>
          </label>

          <input
            id="avatar-input"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            hidden
          />
        </div>

        <form className={styles.form} onSubmit={handleRegister}>
          <input 
            type="text" 
            placeholder="Username" 
            className={styles.inputField}
          />
          <input 
            type="email" 
            placeholder="Email" 
            className={styles.inputField}
          />
          <input 
            type="password" 
            placeholder="Password" 
            className={styles.inputField}
          />

          <button type="submit" className={styles.submitBtn}>
            Sign up
          </button>
        </form>

        <p className={styles.bottomText}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </section>
    </main>
  );
};

export default RegisterPage;