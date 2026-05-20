import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { fetchJoinedEvents } from "../../api/eventsApi";
import styles from "./EventPage.module.css";

const STATUS_COLORS = {
  current: "#c8ceb8",
  upcoming: "#b0bcbb",
  "created by you": "#cac0d4",
};

const PAGE_SIZE = 8;

const EventPage = () => {
  const [page, setPage] = useState(0);
  const navigate = useNavigate();

  const {
    data: events = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["joinedEvents"],
    queryFn: fetchJoinedEvents,
  });

  const totalPages = Math.ceil(events.length / PAGE_SIZE);
  const visible = events.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const handleView = (id) => {
    navigate(`/events/${id}`);
  };

  if (isLoading) {
    return (
      <div className={styles.page}>
        <main className={styles.main}>
          <p>Loading your events...</p>
        </main>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.page}>
        <main className={styles.main}>
          <p>Failed to load your events.</p>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {events.length === 0 ? (
          <p>You haven’t joined any events yet.</p>
        ) : (
          <>
            <div className={styles.grid}>
              {visible.map((event) => {
                const bg = STATUS_COLORS[event.status] ?? "#c8ceb8";

                return (
                  <div
                    key={event.id}
                    className={styles.card}
                    style={{ backgroundColor: bg }}
                  >
                    <div className={styles.cardInfo}>
                      <p>
                        <span className={styles.label}>Title:</span>{" "}
                        {event.title}
                      </p>

                      <p>
                        <span className={styles.label}>Status:</span>{" "}
                        {event.status}
                      </p>

                      <p>
                        <span className={styles.label}>Time:</span>{" "}
                        {event.time}
                      </p>

                      <p>
                        <span className={styles.label}>City:</span>{" "}
                        {event.location}
                      </p>

                      {event.category && (
                        <p>
                          <span className={styles.label}>Category:</span>{" "}
                          {event.category}
                        </p>
                      )}
                    </div>

                    <button
                      className={styles.viewBtn}
                      onClick={() => handleView(event.id)}
                    >
                      View
                    </button>
                  </div>
                );
              })}
            </div>

            <div className={styles.pagination}>
              {page > 0 && (
                <button
                  className={styles.pageBtn}
                  onClick={() => setPage(page - 1)}
                >
                  ← Prev
                </button>
              )}

              {page < totalPages - 1 && (
                <button
                  className={styles.pageBtn}
                  onClick={() => setPage(page + 1)}
                >
                  Next →
                </button>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default EventPage;