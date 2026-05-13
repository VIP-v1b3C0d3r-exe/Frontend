import { apiClient } from "./apiClient";

/**
 * Fetch a list of events with optional filters.
 *
 * @param {Object} params
 * @param {string} [params.city]
 * @param {string} [params.country]
 * @param {string} [params.category_id]   - UUID from /categories
 * @param {string} [params.tag_id]        - UUID from /tags
 * @param {string} [params.date_from]     - "YYYY-MM-DD"
 * @param {string} [params.date_to]       - "YYYY-MM-DD"
 * @param {number} [params.limit=50]
 * @param {number} [params.offset=0]
 * @returns {Promise<Array>} Normalised event objects ready for MapPage / FilterPanel
 */
export const fetchEvents = async (params = {}) => {
  const query = new URLSearchParams();

  if (params.city)        query.set("city",        params.city);
  if (params.country)     query.set("country",     params.country);
  if (params.category_id) query.set("category_id", params.category_id);
  if (params.tag_id)      query.set("tag_id",      params.tag_id);
  if (params.date_from)   query.set("date_from",   params.date_from);
  if (params.date_to)     query.set("date_to",     params.date_to);

  query.set("limit",  params.limit  ?? 50);
  query.set("offset", params.offset ?? 0);

  const data = await apiClient(`/events?${query.toString()}`);

  // Normalise API shape → UI shape expected by MapPage & FilterPanel
  return (data.data ?? []).map(normaliseEvent);
};

/**
 * Fetch a single event by id.
 * @param {number|string} id
 */
export const fetchEvent = async (id) => {
  const data = await apiClient(`/events/${id}`);
  return normaliseEvent(data.data);
};

/**
 * Fetch all categories (used to build the category filter chips).
 * Returns: [{ id, name }, ...]
 */
export const fetchCategories = async () => {
  const data = await apiClient("/categories");
  return data.data ?? [];
};

const normaliseEvent = (event) => ({
  id:          event.id,
  title:       event.title,
  description: event.description ?? "",
  lat:         event.latitude,
  lng:         event.longitude,
  time:        formatTime(event.start_time),
  startTime:   event.start_time,
  endTime:     event.end_time,
  location:    event.city ?? event.location ?? "",
  status:      event.status ?? "upcoming",
  image_url:   event.image_url ?? null,
  category:    event.category ?? "Other",
  subcategory: event.subcategory ?? null,
});

/** "2026-06-01T20:00:00Z"  →  "8:00 PM" */
const formatTime = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-US", {
    hour:   "numeric",
    minute: "2-digit",
    hour12: true,
  });
};
