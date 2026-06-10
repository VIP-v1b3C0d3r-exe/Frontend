import { apiClient } from "./apiClient";

export const fetchEvents = async (params = {}) => {
  const query = new URLSearchParams();

  if (params.city) query.set("city", params.city);
  if (params.country) query.set("country", params.country);
  if (params.category_id) query.set("category_id", params.category_id);
  if (params.tag_id) query.set("tag_id", params.tag_id);
  if (params.date_from) query.set("date_from", `${params.date_from}T00:00:00`);
  if (params.date_to) query.set("date_to", `${params.date_to}T23:59:59`);

  query.set("limit", params.limit ?? 50);
  query.set("offset", params.offset ?? 0);

  const data = await apiClient(`/events?${query.toString()}`);
  return (data.data ?? []).map(normaliseEvent);
};

export const fetchJoinedEvents = async () => {
  const data = await apiClient("/events/me");
  return (data.data ?? []).map(normaliseEvent);
};

export const fetchEvent = async (id) => {
  const data = await apiClient(`/events/${id}`);
  return normaliseEvent(data.data);
};

export const joinEvent = async (id) => {
  const data = await apiClient(`/events/${id}/participants`, {
    method: "POST",
  });

  return data.data;
};

export const leaveEvent = async (id) => {
  const data = await apiClient(`/events/${id}/participants/me`, {
    method: "DELETE",
  });

  return data.data;
};

export const fetchCategories = async () => {
  const data = await apiClient("/categories");
  return data.data ?? [];
};

export const fetchTags = async () => {
  const data = await apiClient("/tags");
  return data.data ?? [];
};

export const createEvent = async (payload) => {
  const body = {
    title: payload.title,
    description: payload.description,
    latitude: payload.latitude,
    longitude: payload.longitude,
    country: payload.country,
    city: payload.city,
    startTime: payload.startTime,
    endTime: payload.endTime,
    maxParticipants: payload.maxParticipants,
    ageRestriction: payload.ageRestriction,
    imageUrl: payload.imageUrl,
    tagIds: payload.tagIds ?? [],
    categoryIds: payload.categoryIds ?? [],
  };

  const data = await apiClient("/events", {
    method: "POST",
    body: JSON.stringify(body),
  });

  const id = typeof data.data === "object" ? data.data?.id : data.data;

  return { id };
};

export const createTag = async (name) => {
  const data = await apiClient("/tags", {
    method: "POST",
    body: JSON.stringify({ name }),
  });

  return data.data;
};

const normaliseEvent = (event) => {
  const now = new Date();
  const start = new Date(event.startTime);
  const end = new Date(event.endTime);
  const isToday = start.toDateString() === now.toDateString();

  let status = "upcoming";

  if (now >= start && now <= end) {
    status = "current";
  } else if (isToday && start > now) {
    status = "current";
  }

  return {
    id: event.id,
    title: event.title,
    description: event.description ?? "",
    lat: event.latitude,
    lng: event.longitude,
    time: formatTime(event.startTime),
    startTime: event.startTime,
    endTime: event.endTime,
    location: event.address ?? event.city ?? event.country ?? "",
    city: event.city ?? "",
    country: event.country ?? "",
    status,
    image_url: event.imageUrl ?? null,
    tagIds: event.tagIds ?? [],
    categoryIds: event.categoryIds ?? [],
    maxParticipants: event.maxParticipants ?? null,
    ageRestriction: event.ageRestriction ?? 0,
    createdBy: event.createdBy ?? null, 
  };
};

const formatTime = (isoString) => {
  if (!isoString) return "";

  const date = new Date(isoString);

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};