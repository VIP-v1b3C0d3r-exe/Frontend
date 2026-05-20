import { apiClient } from "./apiClient";

/**
 * Fetch a list of events with optional filters.
 */
export const fetchEvents = async (params = {}) => {
  const query = new URLSearchParams();

  if (params.city) query.set("city", params.city);
  if (params.country) query.set("country", params.country);
  if (params.category_id) query.set("category_id", params.category_id);
  if (params.tag_id) query.set("tag_id", params.tag_id);
  if (params.date_from) query.set("date_from", params.date_from);
  if (params.date_to) query.set("date_to", params.date_to);

  query.set("limit", params.limit ?? 50);
  query.set("offset", params.offset ?? 0);

  const data = await apiClient(`/events?${query.toString()}`);
  return (data.data ?? []).map(normaliseEvent);
};

/**
 * Fetch events joined by current user.
 */
export const fetchJoinedEvents = async () => {
  const data = await apiClient("/events/me");
  return (data.data ?? []).map(normaliseEvent);
};

/**
 * Fetch a single event by id.
 */
export const fetchEvent = async (id) => {
  const data = await apiClient(`/events/${id}`);
  return normaliseEvent(data.data);
};

/**
 * Fetch all categories.
 * Returns: [{ id, name }, ...]
 */
export const fetchCategories = async () => {
  const data = await apiClient("/categories");
  return data.data ?? [];
};

/**
 * Normalise API event shape → UI shape.
 */
const normaliseEvent = (event) => ({
  id: event.id,
  title: event.title,
  description: event.description ?? "",

  lat: event.latitude,
  lng: event.longitude,

  time: formatTime(event.startTime ?? event.start_time),
  startTime: event.startTime ?? event.start_time,
  endTime: event.endTime ?? event.end_time,

  location: event.city ?? event.country ?? event.address ?? "",

  status: event.status ?? "upcoming",
  image_url: event.imageUrl ?? event.image_url ?? null,

  category: event.category ?? event.categoryName ?? "Other",
  subcategory: event.subcategory ?? null,
  tags: event.tags ?? [],

  createdBy: event.createdBy ?? event.created_by ?? null,
  createdAt: event.createdAt ?? event.created_at ?? null,

  minAge: event.minAge ?? event.min_age ?? event.ageRequirement ?? null,
  capacity: event.capacity ?? null,
  joinedCount: event.joinedCount ?? event.joined_count ?? null,
  isJoined: event.isJoined ?? event.is_joined ?? true,
});

/** "2026-06-01T20:00:00Z" → "8:00 PM" */
const formatTime = (isoString) => {
  if (!isoString) return "";

  const date = new Date(isoString);

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};