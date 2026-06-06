import { useState } from "react";
import { Link } from "react-router-dom";

import { forgotPassword } from "../../api/authApi";

import styles from "./ForgotPasswordPage.module.css";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (event) => {
    event.preventDefault();

    setMessage("");
    setErrorMessage("");
    setLoading(true);

    try {
      await forgotPassword({ email });

      setMessage("Reset token was sent to your email.");
      setEmail("");
    } catch (error) {
      console.error("Forgot password error:", error);
      setErrorMessage("Could not send reset token. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.forgotPage}>
      <section className={styles.forgotCard}>
        <h1 className={styles.title}>Forgot password?</h1>

        <p className={styles.text}>
          Enter your email and we’ll send you instructions to reset your
          password.
        </p>

        <form className={styles.form} onSubmit={handleForgotPassword}>
          <input
            type="email"
            placeholder="Email"
            className={styles.inputField}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          {message && <p className={styles.successMessage}>{message}</p>}

          {errorMessage && (
            <p className={styles.errorMessage}>{errorMessage}</p>
          )}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <Link to="/reset-password" className={styles.backLink}>
          Already have a token? Reset password
        </Link>

        <Link to="/login" className={styles.backLink}>
          Back to log in
        </Link>
      </section>
    </main>
  );
};

export default ForgotPasswordPage;
