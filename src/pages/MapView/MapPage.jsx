import { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./MapPage.module.css";
import FilterPanel from "../../components/FilterPanel/FilterPanel";
import EventForm from "../../components/EventForm/EventForm"
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

// Picking marker icon
const pickIcon = L.divIcon({
  className: "",
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#584D92">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

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

// Handles map clicks for location picking
const MapClickHandler = ({ picking, onPick }) => {
  const map = useMap();
  useEffect(() => {
    if (!picking) return;
    const handler = (e) => onPick(e.latlng.lat, e.latlng.lng);
    map.on("click", handler);
    return () => map.off("click", handler);
  }, [picking, map, onPick]);
  return null;
};

const CATEGORIES = ["Music", "Workshops", "Meetups", "Active", "Food"];

const MapPage = () => {
  const [search,         setSearch]         = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const [panelOpen,      setPanelOpen]      = useState(false);
  const [createOpen,     setCreateOpen]     = useState(false);
  const [picking,        setPicking]        = useState(false);
  const [pickedPos,      setPickedPos]      = useState(null);

  const [events,  setEvents]  = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const loadEvents = useCallback(async (filterParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const results = await fetchEvents({
        // city: "Vilnius",
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

  useEffect(() => { loadEvents(); }, [loadEvents]);

  const handleCategoryClick = (cat) => {
    if (activeCategory === cat && panelOpen) {
      setActiveCategory(null);
      setPanelOpen(false);
    } else {
      setActiveCategory(cat);
      setPanelOpen(true);
      setCreateOpen(false);
    }
  };

  const handleSearchSubmit = () => {
    setPanelOpen(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearchSubmit();
  };

  const handleFilterClose = () => {
    setPanelOpen(false);
    setActiveCategory(null);
    setSearch("");
  };

  const handleFilterChange = useCallback((apiParams) => {
    loadEvents(apiParams);
  }, [loadEvents]);

  const handleFabClick = () => {
    setCreateOpen(true);
    setPanelOpen(false);
    setActiveCategory(null);
  };

  const handleCreateClose = (signal) => {
    if (signal === "picking") {
      setPicking(true);
      setCreateOpen(false);
    } else {
      setCreateOpen(false);
      setPicking(false);
      setPickedPos(null);
    }
  };

  const handleMapPick = useCallback((lat, lng) => {
    setPickedPos({ lat, lng });
    setPicking(false);
    setCreateOpen(true);
  }, []);

  const handleCreated = () => {
    loadEvents();
  };

  const visibleEvents = events.filter((event) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      event.title.toLowerCase().includes(q) ||
      event.location.toLowerCase().includes(q)
    );
  });

  const anyPanelOpen = panelOpen || createOpen;

  return (
    <div className={styles.mapPage}>

      {/* Top bar */}
      <div className={`${styles.topBar} ${anyPanelOpen ? styles.topBarShifted : ""}`}>
        {!anyPanelOpen && (
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

      {/* Filter Panel */}
      <FilterPanel
        events={events}
        activeCategory={activeCategory}
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          if (!val && !activeCategory) setPanelOpen(false);
          console.log("events in FilterPanel:", events.length, events);
        }}
        onClose={handleFilterClose}
        isOpen={panelOpen}
        onFilterChange={handleFilterChange}
        loading={loading}
      />

      {/* Create Event Panel */}
      <EventForm
        isOpen={createOpen}
        onClose={handleCreateClose}
        onCreated={handleCreated}
        pickedPosition={pickedPos}
      />

      {/* Picking hint */}
      {picking && (
        <div className={styles.pickingHint}>
          Click anywhere on the map to set event location
        </div>
      )}

      {/* Map */}
      <MapContainer
        center={[54.6872, 25.2797]}
        zoom={14}
        className={`${styles.map} ${picking ? styles.mapPicking : ""}`}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="bottomright" />
        <LocateMe />
        <MapClickHandler picking={picking} onPick={handleMapPick} />

        {/* Picked location marker */}
        {pickedPos && (
          <Marker position={[pickedPos.lat, pickedPos.lng]} icon={pickIcon} />
        )}

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

      {error && <div className={styles.errorToast}>{error}</div>}

      {/* FAB */}
      <button className={styles.fab} onClick={handleFabClick}>
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
