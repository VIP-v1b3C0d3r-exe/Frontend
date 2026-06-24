import { useState, useEffect, useRef } from "react";
import styles from "./EventForm.module.css";
import TagSearch from "../TagSearch/TagSearch";
import { fetchCategories, fetchTags, createEvent, createTag } from "../../api/eventsApi";
import { reverseGeocode } from "../../utils/geocode";

const EventForm = ({ isOpen, onClose, onCreated, pickedPosition }) => {
  const [categories,    setCategories]    = useState([]);
  const [tags,          setTags]          = useState([]);
  const [selectedTagNames, setSelectedTagNames] = useState([]);
  const [imageFile,     setImageFile]     = useState(null);
  const [imagePreview,  setImagePreview]  = useState(null);
  const [submitting,    setSubmitting]    = useState(false);
  const [error,         setError]         = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category_id: "",
    age_restriction: 0,
    country: "",
    city: "",
    address: "",
    lat: null,
    lng: null,
    date: "",
    start_time: "12:00",
    end_time: "16:00",
    max_participants: 10,
  });

  useEffect(() => {
    if (!pickedPosition) return;
  
    const loadAddress = async () => {
      const geo = await reverseGeocode(
        pickedPosition.lat,
        pickedPosition.lng
      );
  
      setForm(f => ({
        ...f,
        lat: pickedPosition.lat,
        lng: pickedPosition.lng,
        address: geo?.street ?? "",
        city: geo?.city ?? "",
        country: geo?.country ?? "",
      }));
    };
  
    loadAddress();
  }, [pickedPosition]);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(console.error);
    fetchTags().then(setTags).catch(console.error);
  }, []);

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.date || !form.start_time || !form.end_time) {
      setError("Please fill in title, date and times.");
      return;
    }
  
    setSubmitting(true);
    setError(null);
  
    try {
      const startTime = `${form.date}T${form.start_time}:00`;
      const endTime   = `${form.date}T${form.end_time}:00`;

      const tagIds = selectedTagNames
        .map((name) => tags.find((t) => t.name === name)?.id)
        .filter(Boolean);
  
      const payload = {
        title: form.title,
        description: form.description,
        latitude: form.lat ?? 54.6872,
        longitude: form.lng ?? 25.2797,
        country: form.country,
        city: form.city,
        startTime,
        endTime,
        maxParticipants: Number(form.max_participants),
        ageRestriction: Number(form.age_restriction),
        imageUrl: imagePreview ?? null,
        categoryIds: form.category_id ? [Number(form.category_id)] : [],
        tagIds,  // ← сразу в теле
      };
  
      const newEvent = await createEvent(payload); // без tagIds

      if (form.category_id && newEvent?.id) {
        await fetch(
          `${import.meta.env.VITE_API_URL}/events/${newEvent.id}/categories/${form.category_id}`,
          { method: "POST", headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        ).catch(e => console.warn("Category failed:", e));
      }

      for (const tagId of tagIds) {
        await fetch(
          `${import.meta.env.VITE_API_URL}/events/${newEvent.id}/tags/${tagId}`,
          { method: "POST", headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        ).catch(e => console.warn("Tag failed:", e));
      }
  
      // RESET
      setForm({
        title: "",
        description: "",
        category_id: "",
        age_restriction: 0,
        country: "",
        city: "",
        address: "",
        lat: null,
        lng: null,
        date: "",
        start_time: "12:00",
        end_time: "16:00",
        max_participants: 10,
      });
  
      setSelectedTagNames([]);
      setImageFile(null);
      setImagePreview(null);
      setError(null);
  
      onCreated?.();
      onClose();
  
    } catch (err) {
      setError(err.message ?? "Failed to create event.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`${styles.panel} ${isOpen ? styles.panelOpen : styles.panelClosed}`}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>Add your Event</h2>
        <button className={styles.closeBtn} onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <div className={styles.body}>

        {/* Title */}
        <input
          className={styles.input}
          placeholder="Event name"
          value={form.title}
          onChange={e => set("title", e.target.value)}
        />

        {/* Description */}
        <textarea
          className={styles.textarea}
          placeholder="What's this event about?"
          value={form.description}
          onChange={e => set("description", e.target.value)}
        />

        {/* Category + Age */}
        <div className={styles.row}>
          <select
            className={styles.select}
            value={form.category_id}
            onChange={e => set("category_id", e.target.value)}
          >
            <option value="">Event type</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            className={styles.select}
            value={form.age_restriction}
            onChange={e => set("age_restriction", e.target.value)}
          >
            <option value={0}>Any age</option>
            <option value={12}>12+</option>
            <option value={16}>16+</option>
            <option value={18}>18+</option>
            <option value={21}>21+</option>
          </select>
        </div>

        {/* Tags — using TagSearch component */}
        <TagSearch
          onCreateTag={async (name) => {
            const newTag = await createTag(name);
            setTags(prev => [...prev, { id: newTag?.id, name }]);
            return newTag;
          }}
          tags={tags}
          selectedTags={selectedTagNames}
          onTagsChange={setSelectedTagNames}
        />

        {/* Location */}
        <p className={styles.sectionLabel}>Location</p>
        <div className={styles.locationRow}>
          <div className={styles.locationInputs}>
            <input
              className={styles.input}
              placeholder="Country"
              value={form.country}
              onChange={e => set("country", e.target.value)}
            />
            <input
              className={styles.input}
              placeholder="City"
              value={form.city}
              onChange={e => set("city", e.target.value)}
            />
            <input
              className={styles.input}
              placeholder="Address (optional)"
              value={form.address ?? ""}
              onChange={e => set("address", e.target.value)}
            />
            {form.lat && form.lng && (
              <p className={styles.coordsHint}>
                📍 {form.lat.toFixed(4)}, {form.lng.toFixed(4)}
              </p>
            )}
          </div>
          <button type="button" className={styles.mapPickBtn} onClick={() => onClose("picking")}>
            Choose on map
          </button>
        </div>

        {/* Date + Times + Participants */}
        <div className={styles.dateRow}>
          <div className={styles.inputGroup}>
            <label className={styles.sectionLabel}>Date</label>
            <input type="date" className={styles.input}
              value={form.date} onChange={e => set("date", e.target.value)} />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.sectionLabel}>Start</label>
            <input type="time" className={styles.input}
              value={form.start_time} onChange={e => set("start_time", e.target.value)} />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.sectionLabel}>End</label>
            <input type="time" className={styles.input}
              value={form.end_time} onChange={e => set("end_time", e.target.value)} />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.sectionLabel}>Max participants</label>
          <input type="number" className={styles.input} min={1}
            value={form.max_participants}
            onChange={e => set("max_participants", e.target.value)} />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button className={styles.submitBtn} onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Posting..." : "Post Event"}
        </button>
      </div>
    </div>
  );
};

export default EventForm;
