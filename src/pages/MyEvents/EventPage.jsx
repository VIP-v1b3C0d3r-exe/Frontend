import { useState, useEffect } from "react";
import styles from "./EventPage.module.css";
import { apiClient } from "../../api/apiClient";
import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 8;

const STATUS_COLORS = {
  current: "#c8ceb8",
  upcoming: "#b0bcbb",
};

const normaliseStatus = (startTime, endTime) => {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);
  const isToday = start.toDateString() === now.toDateString();
  if (now >= start && now <= end) return "current";
  if (isToday && start > now) return "current";
  return "upcoming";
};

const EventPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await apiClient("/events/me");
        const joined = (data.data ?? []).map((e) => ({
          id: e.id,
          title: e.title,
          startTime: e.startTime,
          endTime: e.endTime,
          time: new Date(e.startTime).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }),
          city: e.city ?? e.country ?? "",
          status: normaliseStatus(e.startTime, e.endTime),
        }));
        setEvents(joined);
      } catch (err) {
        console.error("Failed to load joined events:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totalPages = Math.ceil(events.length / PAGE_SIZE);
  const visible = events.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  if (loading) return <div className={styles.page}>Loading...</div>;

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {events.length === 0 ? (
          <p className={styles.empty}>You haven't joined any events yet.</p>
        ) : (
          <div className={styles.grid}>
            {visible.map((event) => (
              <div
              key={event.id}
              className={styles.card}
              style={{ backgroundColor: STATUS_COLORS[event.status] ?? "#b0bcbb" }}>
                <div className={styles.cardInfo}>
                  <p><span className={styles.label}>Title:</span> {event.title}</p>
                  <p>
                    <span className={styles.label}>Date:</span>{" "}
                    {new Date(event.startTime ?? "").toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })}{" "}
                    · {event.time}
                  </p>
                  <p><span className={styles.label}>City:</span> {event.city}</p>
                </div>
                <button
                  className={styles.viewBtn}
                  onClick={() => navigate(`/events/${event.id}`)}
                >
                  View
                </button>
              </div>
            ))}
          </div>
        )}

        <div className={styles.pagination}>
          {page > 0 && (
            <button className={styles.pageBtn} onClick={() => setPage((p) => p - 1)}>
              ← Prev
            </button>
          )}
          {page < totalPages - 1 && (
            <button className={styles.pageBtn} onClick={() => setPage((p) => p + 1)}>
              Next →
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default EventPage;
