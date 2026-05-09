import { useNavigate, Link } from "react-router-dom";
import styles from "./LoginPage.module.css";

const LoginPage = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    setIsLoggedIn(true);
    navigate("/map");
  };

  return (
    <main className={styles.loginPage}>
      <section className={styles.loginCard}>
        <h1 className={styles.loginTitle}>Welcome back!</h1>

        <form className={styles.loginForm} onSubmit={handleLogin}>
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

          <div className={styles.options}>
            <Link to="/forgot-password">Forgot password?</Link>
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