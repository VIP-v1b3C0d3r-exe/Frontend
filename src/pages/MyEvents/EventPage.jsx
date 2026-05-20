import { useState } from "react";
import styles from "./EventPage.module.css";

// Status → background color mapping (matching screenshot palette)
const STATUS_COLORS = {
  current:        "#c8ceb8", // warm sage green
  upcoming:       "#b0bcbb", // muted teal-grey
  "created by you": "#cac0d4", // soft lavender
};

const STATUS_LABEL = {
  current:        "current",
  upcoming:       "upcoming",
  "created by you": "created by you",
};

// // Mock data — replace with real API call
// const MOCK_EVENTS = [
//   { id: 1,  title: "Sunset Jazz Session",    status: "current",        time: "2pm", city: "Vilnius", address: "Užupis Café" },
//   { id: 2,  title: "Tech Meetup Downtown",   status: "upcoming",       time: "6pm", city: "Vilnius", address: "Cowork Hub" },
//   { id: 3,  title: "Yoga in the Park",       status: "upcoming",       time: "8am", city: "Vilnius", address: "Vingis Park" },
//   { id: 4,  title: "Street Food Festival",   status: "current",        time: "12pm", city: "Vilnius", address: "Old Town Square" },
//   { id: 5,  title: "Photography Workshop",   status: "created by you", time: "3pm", city: "Vilnius", address: "Art House" },
//   { id: 6,  title: "Classical Concert",      status: "current",        time: "7pm", city: "Vilnius", address: "Philharmonic Hall" },
//   { id: 7,  title: "Running Club",           status: "upcoming",       time: "7am", city: "Vilnius", address: "Neris Riverside" },
//   { id: 8,  title: "Vegan Market",           status: "upcoming",       time: "10am", city: "Vilnius", address: "Halės Market" },
//   { id: 9,  title: "Design Thinking Lab",    status: "created by you", time: "2pm", city: "Vilnius", address: "Startup Hub" },
//   { id: 10, title: "Electronic Night",       status: "upcoming",       time: "10pm", city: "Vilnius", address: "Loft Club" },
// ];

const PAGE_SIZE = 8;

const EventPage = () => {
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(MOCK_EVENTS.length / PAGE_SIZE);
  const visible = MOCK_EVENTS.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const handleDismiss = (id) => {
    // placeholder — wire to real state/API
    console.log("dismiss", id);
  };

  return (
    <div className={styles.page}>
      {/* Grid */}
      <main className={styles.main}>
        <div className={styles.grid}>
          {visible.map((event) => {
            const bg = STATUS_COLORS[event.status] ?? "#c8ceb8";
            return (
              <div
                key={event.id}
                className={styles.card}
                style={{ backgroundColor: bg }}
              >
                <button
                  className={styles.dismiss}
                  onClick={() => handleDismiss(event.id)}
                  aria-label="Dismiss"
                >
                  ×
                </button>
                <div className={styles.cardInfo}>
                  <p><span className={styles.label}>Title:</span> {event.title}</p>
                  <p><span className={styles.label}>Status:</span> {STATUS_LABEL[event.status]}</p>
                  <p><span className={styles.label}>Time:</span> {event.time}</p>
                  <p><span className={styles.label}>City:</span> {event.address}</p>
                </div>
                <button className={styles.viewBtn}>View</button>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className={styles.pagination}>
          {page > 0 && (
            <button className={styles.pageBtn} onClick={() => setPage(page - 1)}>
              ← Prev
            </button>
          )}
          {page < totalPages - 1 && (
            <button className={styles.pageBtn} onClick={() => setPage(page + 1)}>
              Next →
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default EventPage;
