import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";

import { registerUser } from "../../api/authApi";

import styles from "./RegisterPage.module.css";

const RegisterPage = ({ setProfileImage, setUsername }) => {
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");

  const handleRegister = async (event) => {
    event.preventDefault();

    try {
      await registerUser({
        username: name,
        email,
        password,
        age: Number(age),
      });

      if (name.trim()) {
        setUsername(name.trim());
      }

      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);

      setImage(imageUrl);
      setProfileImage(imageUrl);
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
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            className={styles.inputField}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className={styles.inputField}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <input
            type="number"
            placeholder="Age"
            className={styles.inputField}
            value={age}
            onChange={(event) => setAge(event.target.value)}
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
