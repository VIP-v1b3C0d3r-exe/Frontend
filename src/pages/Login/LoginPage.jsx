import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

import { loginUser } from "../../api/authApi";
import { setToken } from "../../utils/token";

import styles from "./LoginPage.module.css";

const LoginPage = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const data = await loginUser({
        email,
        password,
      });

      console.log("Login response:", data);

      const token =
        data?.data?.access_token ||
        data?.data?.accessToken ||
        data?.data?.token ||
        data?.access_token ||
        data?.accessToken ||
        data?.token;

      if (!token) {
        console.error("Token not found:", data);
        return;
      }

      setToken(token);
      localStorage.setItem("token", token);

      setIsLoggedIn(true);

      navigate("/my-events");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <main className={styles.loginPage}>
      <section className={styles.loginCard}>
        <h1 className={styles.loginTitle}>Welcome back!</h1>

        <p className={styles.loginSubtitle}>
          Log in to continue exploring events
        </p>

        <form className={styles.loginForm} onSubmit={handleLogin}>
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

          <div className={styles.options}>
            <Link to="/forgot-password" className={styles.forgotPassword}>
              Forgot password?
            </Link>
          </div>

          <button type="submit" className={styles.submitBtn}>
            Log in
          </button>
        </form>

        <p className={styles.bottomText}>
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </p>
      </section>
    </main>
  );
};

export default LoginPage;