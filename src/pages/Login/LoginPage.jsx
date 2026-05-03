import { useNavigate, Link } from "react-router-dom";

import "../../styles/Login.css";

const LoginPage = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();

    setIsLoggedIn(true);
    navigate("/map");
  };

  return (
    <main className="login-page">
      <section className="login-card">
      <h1 className="login-title">Welcome back!</h1>
    

        <form className="login-form" onSubmit={handleLogin}>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />

          <div className="login-options">
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          <button type="submit">Log in</button>
        </form>

        <p className="login-bottom-text">
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </p>
      </section>
    </main>
  );
};

export default LoginPage;