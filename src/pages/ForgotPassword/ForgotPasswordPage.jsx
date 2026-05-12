import { Link } from "react-router-dom";


import styles from "./ForgotPasswordPage.module.css";

const ForgotPasswordPage = () => {
  return (
    <main className={styles.forgotPage}>

      <section className={styles.forgotCard}>
        <h1 className={styles.title}>Forgot password?</h1>

        <p className={styles.text}>
          Enter your email and we’ll send you instructions
          to reset your password.
        </p>

        <form className={styles.form}>
          <input
            type="email"
            placeholder="Email"
            className={styles.inputField}
          />

          <button type="submit" className={styles.submitBtn}>
            Send reset link
          </button>
        </form>

        <Link to="/login" className={styles.backLink}>
          Back to log in
        </Link>
      </section>
    </main>
  );
};

export default ForgotPasswordPage;