import { Link } from "react-router-dom";
import styles from "./ResetPasswordPage.module.css";

function ResetPasswordPage() {
  return (
    <main className={styles.resetPage}>
      <section className={styles.resetCard}>
        <h1 className={styles.resetTitle}>Reset password</h1>

        <p className={styles.resetSubtitle}>
          Enter your reset token and create a new password.
        </p>

        <form className={styles.resetForm}>
          <input
            className={styles.inputField}
            type="text"
            placeholder="Reset token"
          />

          <input
            className={styles.inputField}
            type="password"
            placeholder="New password"
          />

          <input
            className={styles.inputField}
            type="password"
            placeholder="Confirm password"
          />

          <button className={styles.submitBtn} type="submit">
            Reset password
          </button>
        </form>

        <p className={styles.bottomText}>
          Remembered your password? <Link to="/login">Back to log in</Link>
        </p>
      </section>
    </main>
  );
}

export default ResetPasswordPage;