import { useState, useRef, useEffect } from "react";
import styles from "./FilterPanel.module.css";

const CATEGORY_TREE = {
  Music: ["Jazz", "Rock", "Classical", "Electronic", "Folk"],
  Workshops: ["Coding", "Art", "Cooking", "Photography", "Design"],
  Meetups: ["Networking", "Social", "Professional", "Community"],
  Active: ["Running", "Cycling", "Yoga", "Hiking", "Swimming"],
  Food: ["Street Food", "Fine Dining", "Vegan", "BBQ", "Market"],
};

const EVENT_IMAGES = {
  Music: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=120&q=80",
  Workshops: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=120&q=80",
  Meetups: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=120&q=80",
  Active: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=120&q=80",
  Food: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=120&q=80",
};

// --- Dropdown for top filter buttons (Time, Place, etc.) ---
const FilterDropdown = ({ label, children, activeCount }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
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
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {open && <div className={styles.dropdown}>{children}</div>}
    </div>
  );
};

// --- The New Dropdown Category Item ---
const CategoryDropdown = ({ 
  category, 
  subcategories, 
  selectedSubs, 
  onToggleSub, 
  isActive, 
  onToggleCategory 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.categoryDropdownGroup}>
      <div className={styles.categoryHeaderRow}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={isActive}
            onChange={() => onToggleCategory(category)}
            className={styles.checkbox}
          />
          <span className={styles.checkboxText}>{category}</span>
        </label>
        
        <button 
          className={styles.expandBtn} 
          onClick={() => setIsOpen(!isOpen)}
          type="button"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" 
            style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "0.2s" }}
          >
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className={styles.treeChildren}>
          {subcategories.map(sub => {
            const key = `${category}::${sub}`;
            return (
              <label key={sub} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={selectedSubs.includes(key)}
                  onChange={() => onToggleSub(key)}
                  className={styles.checkbox}
                />
                <span className={styles.checkboxTextSub}>{sub}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
};

// --- Main FilterPanel ---
const FilterPanel = ({ events, activeCategory, search, onSearchChange, onClose, isOpen }) => {
  const [selectedCategories, setSelectedCategories] = useState(activeCategory ? [activeCategory] : []);
  const [selectedSubs, setSelectedSubs] = useState([]);
  const [locationFilter, setLocationFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [timeOfDay, setTimeOfDay] = useState(null);

  // Sync state when a button is clicked in the parent MapPage
  useEffect(() => {
    if (activeCategory && !selectedCategories.includes(activeCategory)) {
      setSelectedCategories([activeCategory]);
    }
  }, [activeCategory]);

  const toggleCategory = (cat) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const toggleSub = (key) => {
    setSelectedSubs(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  // Logic for filtering
  const filtered = events.filter((event) => {
    // 1. Search filter
    const matchesSearch =
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.location.toLowerCase().includes(search.toLowerCase());

    // 2. Category & Sub-category filter
    let matchesCategory = true;
    if (selectedCategories.length > 0) {
      const isParentCategorySelected = selectedCategories.includes(event.category);
      
      const activeSubsForThisCat = selectedSubs
        .filter(s => s.startsWith(`${event.category}::`))
        .map(s => s.split("::")[1]);

      if (!isParentCategorySelected) {
        matchesCategory = false;
      } else if (activeSubsForThisCat.length > 0) {
        // If specific sub-boxes are checked, only show those.
        // Otherwise, show everything in the parent category.
        matchesCategory = activeSubsForThisCat.includes(event.subcategory);
      }
    }

    const matchesLocation = locationFilter ? event.location.toLowerCase().includes(locationFilter.toLowerCase()) : true;
    const matchesTime = timeOfDay ? (timeOfDay === "AM" ? parseInt(event.time) < 12 : parseInt(event.time) >= 12) : true;

    return matchesSearch && matchesCategory && matchesLocation && matchesTime;
  });

  return (
    <div className={`${styles.panel} ${isOpen ? styles.panelOpen : styles.panelClosed}`}>

      {/* Search Header */}
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
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </div>
        <button className={styles.closeBtn} onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      {/* Dropdown Filters Row */}
      <div className={styles.filterBtnsRow}>
        <FilterDropdown label="Time" activeCount={(dateFilter ? 1 : 0) + (timeOfDay ? 1 : 0)}>
          <div className={styles.dropdownContent}>
            <label className={styles.dropdownLabel}>Date</label>
            <input type="date" className={styles.dropdownInput} value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
            <div className={styles.ampmRow}>
              <button className={`${styles.ampmBtn} ${timeOfDay === "AM" ? styles.ampmActive : ""}`} onClick={() => setTimeOfDay(timeOfDay === "AM" ? null : "AM")}>AM</button>
              <button className={`${styles.ampmBtn} ${timeOfDay === "PM" ? styles.ampmActive : ""}`} onClick={() => setTimeOfDay(timeOfDay === "PM" ? null : "PM")}>PM</button>
            </div>
          </div>
        </FilterDropdown>

        <FilterDropdown label="Place" activeCount={locationFilter ? 1 : 0}>
          <div className={styles.dropdownContent}>
            <input type="text" className={styles.dropdownInput} value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} placeholder="e.g. Old Town" />
          </div>
        </FilterDropdown>
      </div>

      <div className={styles.categoryHeader}>
        <h2 className={styles.panelTitle}>{activeCategory || "All Events"}</h2>
        <span className={styles.count}>{filtered.length}</span>
      </div>

      {/* The Scrollable Category List */}
      <div className={styles.treeBox}>
        {Object.entries(CATEGORY_TREE).map(([cat, subs]) => (
          <CategoryDropdown
            key={cat}
            category={cat}
            subcategories={subs}
            selectedSubs={selectedSubs}
            onToggleSub={toggleSub}
            isActive={selectedCategories.includes(cat)}
            onToggleCategory={toggleCategory}
          />
        ))}
      </div>

      {/* List of results */}
      <div className={styles.list}>
        {filtered.length === 0 ? (
          <p className={styles.empty}>No events found</p>
        ) : (
          filtered.map((event) => (
            <div key={event.id} className={styles.card}>
              <img src={EVENT_IMAGES[event.category]} alt={event.title} className={styles.cardImage} />
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{event.title}</h3>
                <p className={styles.cardMeta}>{event.time} · {event.location}</p>
                <div className={styles.tags}>
                  <span className={styles.tag}>{event.category}</span>
                  {event.subcategory && <span className={styles.tag}>{event.subcategory}</span>}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FilterPanel;