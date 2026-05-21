import { useState, useEffect } from "react";
import styles from "./EventPage.module.css";
import { apiClient } from "../../api/apiClient";
import { fetchEvents } from "../../api/eventsApi";

const STATUS_COLORS = {
  current: "#c8ceb8",
  upcoming: "#b0bcbb",
  "created by you": "#cac0d4",
};

const PAGE_SIZE = 8;

const normaliseStatus = (event, createdByMe) => {
  if (createdByMe) return "created by you";
  const now   = new Date();
  const start = new Date(event.startTime);
  const end   = new Date(event.endTime);
  const isToday = start.toDateString() === now.toDateString();
  if (now >= start && now <= end) return "current";
  if (isToday && start > now) return "current";
  return "upcoming";
};

const EventPage = () => {
  const [events,  setEvents]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [page,    setPage]    = useState(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // события которые ты заджойнила
        const joinedData = await apiClient("/events/me");
        const joined = (joinedData.data ?? []).map(e => ({
          id:        e.id,
          title:     e.title,
          startTime: e.startTime,
          time:      new Date(e.startTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
          city:      e.city ?? "",
          address:   e.city ?? e.country ?? "",
          status:    normaliseStatus(e, false),
        }));

        // события созданные тобой
        const allEvents = await fetchEvents({ limit: 50 });
        // GET /events/me возвращает joined, для created нужен отдельный эндпоинт
        // пока покажем все события
        const all = allEvents.map(e => ({
          id:        e.id,
          title:     e.title,
          startTime: e.startTime,
          time:      e.time,
          city:      e.city,
          address:   e.location,
          status:    normaliseStatus(e, false),
        }));

        // объединяем без дублей
        const joinedIds = new Set(joined.map(e => e.id));
        const merged = [
          ...joined,
          ...all.filter(e => !joinedIds.has(e.id)),
        ];

        setEvents(merged);
      } catch (err) {
        console.error("Failed to load events:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totalPages = Math.ceil(events.length / PAGE_SIZE);
  const visible    = events.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const handleDismiss = (id) => {
    console.log("dismiss", id);
  };

  if (loading) return <div className={styles.page}>Loading...</div>;

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.grid}>
          {visible.map((event) => {
            const bg = STATUS_COLORS[event.status] ?? "#c8ceb8";
            return (
              <div key={event.id} className={styles.card} style={{ backgroundColor: bg }}>
                <button
                  className={styles.dismiss}
                  onClick={() => handleDismiss(event.id)}
                  aria-label="Dismiss"
                >×</button>
                <div className={styles.cardInfo}>
                <div className={styles.cardInfo}>
                <p><span className={styles.label}>Title:</span> {event.title}</p>
                <p><span className={styles.label}>Status:</span> {STATUS_LABEL[event.status]}</p>
                <p><span className={styles.label}>Date:</span> {new Date(event.startTime ?? "").toLocaleDateString("en-GB", { day: "numeric", month: "short" })} · {event.time}</p>
                <p><span className={styles.label}>City:</span> {event.address}</p>
              </div>
                </div>
                <button className={styles.viewBtn}>View</button>
              </div>
            );
          })}
        </div>

        <div className={styles.pagination}>
          {page > 0 && (
            <button className={styles.pageBtn} onClick={() => setPage(p => p - 1)}>← Prev</button>
          )}
          {page < totalPages - 1 && (
            <button className={styles.pageBtn} onClick={() => setPage(p => p + 1)}>Next →</button>
          )}
        </div>
      </main>
    </div>
  );
};

export default EventPage;