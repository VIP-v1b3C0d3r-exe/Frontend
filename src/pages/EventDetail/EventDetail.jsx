import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./EventDetail.module.css";
import {
  fetchEvent,
  joinEvent,
  leaveEvent,
  fetchTags,
} from "../../api/eventsApi";
import { apiClient } from "../../api/apiClient";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joined, setJoined] = useState(false);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState(null);

  const loadEventData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const ev = await fetchEvent(id);
      setEvent(ev);

      const partData = await apiClient(`/events/${id}/participants`);
      const parts = partData.data ?? [];
      setParticipants(parts);

      const me = localStorage.getItem("username");

      if (me) {
        setJoined(parts.some((participant) => participant.username === me));
      }

      const allTags = await fetchTags();

      if (ev.tagIds?.length > 0) {
        setTags(allTags.filter((tag) => ev.tagIds.includes(tag.id)));
      } else {
        setTags([]);
      }
    } catch (err) {
      console.error("Could not load event:", err);
      setError("Could not load event.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadEventData();
  }, [loadEventData]);

  const handleJoin = async () => {
    setJoining(true);

    try {
      if (joined) {
        await leaveEvent(id);
        setJoined(false);
      } else {
        await joinEvent(id);
        setJoined(true);
      }

      const partData = await apiClient(`/events/${id}/participants`);
      setParticipants(partData.data ?? []);
    } catch (err) {
      console.error("Join/leave failed:", err);
      alert("Could not update participation. Please try again.");
    } finally {
      setJoining(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this event?")) return;

    try {
      await apiClient(`/events/${id}`, { method: "DELETE" });
      navigate(-1);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.skeleton} />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className={styles.page}>
        <p className={styles.errorMsg}>{error ?? "Event not found."}</p>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>
    );
  }

  const startDate = new Date(event.startTime);
  const endDate = new Date(event.endTime);

  const dateStr = startDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const timeStr = `${startDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })} – ${endDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })}`;

  const address = [event.city, event.country].filter(Boolean).join(", ");
  const imageUrl = event.image_url ?? DEFAULT_IMAGE;

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.imageWrap}>
          <div className={styles.imageFallback}>
            <img
              src={imageUrl}
              alt={event.title}
              onError={(e) => {
                e.target.src = DEFAULT_IMAGE;
              }}
            />
          </div>

          <div className={styles.dataWrap}>
            <div className={styles.dateMeta}>
              {dateStr} {timeStr}
            </div>

            <div className={styles.locationMeta}>
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ flexShrink: 0, marginTop: 2 }}
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>

              <span>{address || "Location TBD"}</span>
            </div>

            <div className={styles.crowdMeta}>
              <span>Crowd: {event.maxParticipants} max</span>
              <span>{participants.length} attending</span>
            </div>

            <div className={styles.ageMeta}>
              {event.ageRestriction > 0
                ? `${event.ageRestriction}+`
                : "Free entry"}
            </div>

            <div className={styles.actions}>
              <button
                className={`${styles.joinBtn} ${
                  joined ? styles.joinBtnLeave : ""
                }`}
                onClick={handleJoin}
                disabled={joining}
              >
                {joining ? "..." : joined ? "Leave" : "Join"}
              </button>

              <button className={styles.deleteBtn} onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>

        <div className={styles.info}>
          <h1 className={styles.title}>{event.title}</h1>

          {event.description && (
            <p className={styles.description}>{event.description}</p>
          )}

          {tags.length > 0 && (
            <div className={styles.tags}>
              {tags.map((tag) => (
                <span key={tag.id} className={styles.tag}>
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        Back to all →
      </button>
    </div>
  );
};

export default EventDetail;