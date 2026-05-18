import { apiClient } from "./apiClient";

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
  return (data.data ?? []).map(normaliseEvent);
};

export const fetchEvent = async (id) => {
  const data = await apiClient(`/events/${id}`);
  return normaliseEvent(data.data);
};

export const fetchCategories = async () => {
  const data = await apiClient("/categories");
  return data.data ?? [];
};

export const fetchTags = async () => {
  const data = await apiClient("/tags");
  return data.data ?? [];
};

const normaliseEvent = (event) => {
  const now = new Date();
  const start = new Date(event.startTime);
  const end = new Date(event.endTime);
  let status = "upcoming";
  if (now >= start && now <= end) status = "current";

  return {
    id:          event.id,
    title:       event.title,
    description: event.description ?? "",
    lat:         event.latitude,
    lng:         event.longitude,
    time:        formatTime(event.startTime),
    startTime:   event.startTime,
    endTime:     event.endTime,
    location:    event.city ?? event.country ?? "",
    city:        event.city ?? "",
    country:     event.country ?? "",
    status,
    image_url:   event.imageUrl ?? null,
    tagIds:      event.tagIds ?? [],
    categoryIds: event.categoryIds ?? [],
  };
};

const formatTime = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-US", {
    hour:   "numeric",
    minute: "2-digit",
    hour12: true,
  });
};
