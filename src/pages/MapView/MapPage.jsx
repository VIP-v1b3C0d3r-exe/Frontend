import { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./MapPage.module.css";
import FilterPanel from "../../components/FilterPanel/FilterPanel";
import { fetchEvents } from "../../api/eventsApi";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const createStarIcon = (color) =>
  L.divIcon({
    className: "",
    html: `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 51 48">
      <path fill="${color}" d="M25 1l6 17h18L36 29l5 17-16-11-16 11 5-17L1 18h18z"/>
    </svg>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });

const blueIcon  = createStarIcon("#3b7edb");
const greenIcon = createStarIcon("#2e8f2e");

// Locate-me control

const LocateMe = () => {
  const map = useMap();
  const handleLocate = () => {
    map.locate({ setView: true, maxZoom: 15 });
    map.once("locationfound", (e) => {
      L.circleMarker(e.latlng, {
        radius: 8, fillColor: "#3b7edb",
        color: "white", weight: 2, fillOpacity: 1,
      }).addTo(map);
    });
    map.once("locationerror", () => {
      alert("Could not get your location. Please allow location access.");
    });
  };

  return (
    <button className={styles.locateBtn} onClick={handleLocate}>
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
           fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
      </svg>
    </button>
  );
};

// MapPage

const CATEGORIES = ["Music", "Workshops", "Meetups", "Active", "Food"];

const MapPage = () => {
  // UI state
  const [search,         setSearch]         = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const [panelOpen,      setPanelOpen]      = useState(false);

  // Data state
  const [events,  setEvents]  = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  // Fetch helpers ё

  /**
   * Load events from the API.
   * `filterParams` is merged with whatever the FilterPanel provides
   * (date_from / date_to / location come from the panel; category_id
   *  is resolved from the active chip).
   */
  const loadEvents = useCallback(async (filterParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const results = await fetchEvents({
        city: "Vilnius",   // default city — adjust or make dynamic as needed
        ...filterParams,
      });
      setEvents(results);
    } catch (err) {
      console.error("Failed to load events:", err);
      setError("Could not load events. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Panel / chip interaction (unchanged logic)
  const handleCategoryClick = (cat) => {
    if (activeCategory === cat && panelOpen) {
      setActiveCategory(null);
      setPanelOpen(false);
    } else {
      setActiveCategory(cat);
      setPanelOpen(true);
    }
  };

  const handleSearchSubmit = () => {
    if (search.length > 0) setPanelOpen(true);
    else if (!activeCategory) setPanelOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearchSubmit();
  };

  const handleClose = () => {
    setPanelOpen(false);
    setActiveCategory(null);
    setSearch("");
  };

  /**
   * Called by FilterPanel whenever its filter state changes.
   * The panel passes the resolved API-compatible params so MapPage
   * can re-fetch and keep the map markers in sync.
   *
   * @param {Object} apiParams  e.g. { category_id, date_from, date_to }
   */
  const handleFilterChange = useCallback((apiParams) => {
    loadEvents(apiParams);
  }, [loadEvents]);

  // Map markers: client-side text search on top of API results
  const visibleEvents = events.filter((event) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      event.title.toLowerCase().includes(q) ||
      event.location.toLowerCase().includes(q)
    );
  });

  // Render
  return (
    <div className={styles.mapPage}>

      {/* Top bar */}
      <div className={`${styles.topBar} ${panelOpen ? styles.topBarShifted : ""}`}>

        {!panelOpen && (
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="What's the move?"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              className={styles.searchInput}
            />
            <button className={styles.searchBtn} onClick={handleSearchSubmit}>
              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"
                   fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>
          </div>
        )}

        <div className={styles.filters}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`${styles.filterChip} ${activeCategory === cat ? styles.filterChipActive : ""}`}
              onClick={() => handleCategoryClick(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Panel — receives all events so it can do client-side sub-filtering */}
      <FilterPanel
        events={events}
        activeCategory={activeCategory}
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          if (!val && !activeCategory) setPanelOpen(false);
        }}
        onClose={handleClose}
        isOpen={panelOpen}
        onFilterChange={handleFilterChange}
        loading={loading}
      />

      {/* Map */}
      <MapContainer
        center={[54.6872, 25.2797]}
        zoom={14}
        className={styles.map}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="bottomright" />
        <LocateMe />

        {visibleEvents.map((event) => (
          <Marker
            key={event.id}
            position={[event.lat, event.lng]}
            icon={event.status === "current" ? greenIcon : blueIcon}
          >
            <Popup className={styles.popup}>
              <div className={styles.popupContent}>
                <span className={`${styles.popupStatus} ${event.status === "current" ? styles.current : styles.upcoming}`}>
                  {event.status === "current" ? "Now" : "Upcoming"}
                </span>
                <h3 className={styles.popupTitle}>{event.title}</h3>
                <p className={styles.popupMeta}>{event.time} · {event.location}</p>
                <button className={styles.popupBtn}>View Event</button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Error toast */}
      {error && <div className={styles.errorToast}>{error}</div>}

      <button className={styles.fab}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
             fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </button>

      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={styles.legendDotGreen} /> Current
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendDotBlue} /> Upcoming
        </span>
      </div>
    </div>
  );
};

export default MapPage;
