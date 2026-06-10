import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { apiClient } from "../../api/apiClient";
import { loginUser } from "../../api/authApi";

import styles from "./LoginPage.module.css";
import { setRefreshToken, setToken, getRoleFromToken } from "../../utils/token";

const LoginPage = ({ setIsLoggedIn, setRole }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    setErrorMessage("");
  
    try {
      const response = await loginUser({ email, password });
  
      console.log("Login response:", response);
  
      const accessToken =
        response?.data?.access_token ||
        response?.data?.accessToken ||
        response?.access_token;
  
      const refreshToken =
        response?.data?.refresh_token ||
        response?.data?.refreshToken ||
        response?.refresh_token;
  
      if (!accessToken) {
        setErrorMessage("Login failed. Access token was not received.");
        return;
      }
  
      setToken(accessToken);
      if (refreshToken) setRefreshToken(refreshToken);
      setIsLoggedIn(true);

      // получаем роль через /users/me
      try {
        const userResponse = await apiClient("/users/me");
        const userRole = userResponse?.data?.role ?? null;
        setRole?.(userRole);
        if (userRole) localStorage.setItem("role", userRole);
      } catch {
        // игнорируем если не работает
      }

      navigate("/my-events");
  
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Incorrect email or password.");
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

          {errorMessage && (
            <p className={styles.errorMessage}>{errorMessage}</p>
          )}

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