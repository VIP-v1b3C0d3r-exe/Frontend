import { useState } from "react";
import { blockUser, unblockUser, upgradeUser } from "../../api/adminApi";
import styles from "./AdminPage.module.css";

const AdminPage = () => {
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAction = async (action) => {
    if (!userId.trim()) {
      setError("Please enter a user ID.");
      return;
    }
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      if (action === "block") await blockUser(userId);
      if (action === "unblock") await unblockUser(userId);
      if (action === "upgrade") await upgradeUser(userId);
      setMessage(`User ${userId} ${action}ed successfully.`);
    } catch (err) {
      setError(err.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Admin Panel</h1>
        <div className={styles.inputRow}>
          <input
            className={styles.input}
            type="text"
            placeholder="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </div>
        <div className={styles.buttons}>
          <button
            className={`${styles.btn} ${styles.btnBlock}`}
            onClick={() => handleAction("block")}
            disabled={loading}
          >
            Block
          </button>
          <button
            className={`${styles.btn} ${styles.btnUnblock}`}
            onClick={() => handleAction("unblock")}
            disabled={loading}
          >
            Unblock
          </button>
          <button
            className={`${styles.btn} ${styles.btnUpgrade}`}
            onClick={() => handleAction("upgrade")}
            disabled={loading}
          >
            Upgrade
          </button>
        </div>
        {message && <p className={styles.success}>{message}</p>}
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
};

export default AdminPage;