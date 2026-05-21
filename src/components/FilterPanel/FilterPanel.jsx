import { useState, useRef, useEffect, useCallback } from "react";
import styles from "./FilterPanel.module.css";
import { fetchCategories, fetchTags } from "../../api/eventsApi";
import TagSearch from "../TagSearch/TagSearch";

const EVENT_IMAGES = {
  Music:     "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=120&q=80",
  Workshops: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=120&q=80",
  Meetups:   "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=120&q=80",
  Active:    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=120&q=80",
  Food:      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=120&q=80",
};

const FilterDropdown = ({ label, children, activeCount }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className={styles.dropdownWrap} ref={ref}>
      <button
        className={`${styles.filterBtn} ${activeCount > 0 ? styles.filterBtnActive : ""}`}
        onClick={() => setOpen(!open)}
      >
        {label}
        {activeCount > 0 && <span className={styles.filterBadge}>{activeCount}</span>}
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
             fill="none" stroke="currentColor" strokeWidth="2"
             style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {open && <div className={styles.dropdown}>{children}</div>}
    </div>
  );
};

const FilterPanel = ({
  events,
  activeCategory,
  search,
  onSearchChange,
  onClose,
  isOpen,
  onFilterChange,
  loading = false,
}) => {
  const [locationFilter, setLocationFilter] = useState("");
  const [dateFilter,     setDateFilter]     = useState("");
  const [timeOfDay,      setTimeOfDay]      = useState(null);
  const [selectedTags,   setSelectedTags]   = useState([]); // [{ id, name }]
  const [tags,           setTags]           = useState([]);
  const [categoryMap,    setCategoryMap]    = useState({}); // { "Music": 1, ... }

  // Load tags and categories from API
  useEffect(() => {
    fetchTags()
      .then(setTags)
      .catch((err) => console.error("Failed to load tags:", err));

    fetchCategories()
      .then((cats) => {
        const map = {};
        cats.forEach((c) => { map[c.name] = c.id; });
        setCategoryMap(map);
      })
      .catch((err) => console.error("Failed to load categories:", err));
  }, []);

  // When activeCategory or categoryMap changes → emit category_id to MapPage
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (!onFilterChange || Object.keys(categoryMap).length === 0) return;
    const params = {};
    if (locationFilter) params.city = locationFilter;
    if (dateFilter) {
      params.date_from = dateFilter;
      params.date_to   = dateFilter;
    }
    onFilterChange(params);
  }, [activeCategory, categoryMap, locationFilter, dateFilter]);

  const handleLocationChange = (val) => setLocationFilter(val);
  const handleDateChange     = (val) => setDateFilter(val);

  const handleTagsChange = (newTags) => {
    setSelectedTags(newTags);
  }

  const filtered = events.filter((event) => {
    const matchesSearch =
      !search ||
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      (event.location ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (event.address ?? "").toLowerCase().includes(search.toLowerCase());

    const matchesCategory = !activeCategory ||
      (event.categoryIds && event.categoryIds.includes(categoryMap[activeCategory]));

      const matchesTags = (() => {
        if (selectedTags.length === 0) return true;
        return selectedTags.some((selectedName) => {
          const tag = tags.find((t) => t.name === selectedName);
          return tag && (event.tagIds ?? []).includes(tag.id);
        });
      })();

    const matchesTime = timeOfDay ? (() => {
      const hour = new Date(event.startTime).getHours();
      return timeOfDay === "AM" ? hour < 12 : hour >= 12;
    })() : true;

    const matchesLocation =
      !locationFilter ||
      (event.address ?? "").toLowerCase().includes(locationFilter.toLowerCase()) ||
      (event.city ?? "").toLowerCase().includes(locationFilter.toLowerCase()) ||
      (event.country ?? "").toLowerCase().includes(locationFilter.toLowerCase());

    return matchesSearch && matchesCategory && matchesTags && matchesTime && matchesLocation;
});
    const getCategoryImage = (event) => {
      if (event.image_url) return event.image_url;
      const categoryName = Object.keys(categoryMap).find(
        name => event.categoryIds?.includes(categoryMap[name])
      );
      return EVENT_IMAGES[categoryName] ?? EVENT_IMAGES.Music;
    };

  return (
    <div className={`${styles.panel} ${isOpen ? styles.panelOpen : styles.panelClosed}`}>
      <div className={styles.searchRow}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className={styles.searchInput}
            autoFocus={isOpen}
          />
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
               fill="none" stroke="#aaa" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </div>
        <button className={styles.closeBtn} onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <div className={styles.filterBtnsRow}>
        <FilterDropdown label="Time" activeCount={(dateFilter ? 1 : 0) + (timeOfDay ? 1 : 0)}>
          <div className={styles.dropdownContent}>
            <label className={styles.dropdownLabel}>Date</label>
            <div className={styles.dateInputRow}>
              <input
                type="date"
                className={styles.dropdownInput}
                value={dateFilter}
                onChange={(e) => handleDateChange(e.target.value)}
              />
              {dateFilter && (
                <button className={styles.clearDate} onClick={() => handleDateChange("")}>✕</button>
              )}
            </div>
            <div className={styles.ampmRow}>
              <button
                className={`${styles.ampmBtn} ${timeOfDay === "AM" ? styles.ampmActive : ""}`}
                onClick={() => setTimeOfDay(timeOfDay === "AM" ? null : "AM")}
              >AM</button>
              <button
                className={`${styles.ampmBtn} ${timeOfDay === "PM" ? styles.ampmActive : ""}`}
                onClick={() => setTimeOfDay(timeOfDay === "PM" ? null : "PM")}
              >PM</button>
            </div>
          </div>
        </FilterDropdown>

        <FilterDropdown label="Place" activeCount={locationFilter ? 1 : 0}>
          <div className={styles.dropdownContent}>
            <input
              type="text"
              className={styles.dropdownInput}
              value={locationFilter}
              onChange={(e) => handleLocationChange(e.target.value)}
              placeholder="e.g. Vilnius"
            />
          </div>
        </FilterDropdown>
      </div>

      <div className={styles.categoryHeader}>
        <h2 className={styles.panelTitle}>{activeCategory || "All Events"}</h2>
        <span className={styles.count}>{loading ? "…" : filtered.length}</span>
      </div>

      <TagSearch
        tags={tags}
        selectedTags={selectedTags}
        onTagsChange={handleTagsChange}
      />

      <div className={styles.list}>
        {loading ? (
          <p className={styles.empty}>Loading events…</p>
        ) : filtered.length === 0 ? (
          <p className={styles.empty}>No events found</p>
        ) : (
          filtered.map((event) => (
            <div key={event.id} className={styles.card}>
              <img
                src={getCategoryImage(event)}
                alt={event.title}
                className={styles.cardImage}
                onError={(e) => { e.target.src = EVENT_IMAGES.Music; }}
              />
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{event.title}</h3>
                <p className={styles.cardMeta}>
                  {new Date(event.startTime).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} · {event.time} · {event.city || event.location}
                </p>
                {event.ageRestriction > 0 && (
                  <span className={styles.tag}>{event.ageRestriction}+</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FilterPanel;
