import { useState, useRef, useEffect } from "react";
import styles from "./TagSearch.module.css";

/**
 * TagSearch
 * ─────────
 * Props:
 *   tags          – all available tags from API [{ name: "Outdoor" }, ...]
 *   selectedTags  – array of selected tag names
 *   onTagsChange  – (newSelectedTags: string[]) => void
 */
const TagSearch = ({ tags = [], selectedTags = [], onTagsChange }) => {
  const [input, setInput] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const suggestions = tags.filter(
    (t) =>
      t.name.toLowerCase().includes(input.toLowerCase()) &&
      !selectedTags.includes(t.name)
  );

  const showDropdown = focused && input.length > 0 && suggestions.length > 0;

  const addTag = (name) => {
    onTagsChange([...selectedTags, name]);
    setInput("");
    inputRef.current?.focus();
  };

  const removeTag = (name) => {
    onTagsChange(selectedTags.filter((t) => t !== name));
  };

  useEffect(() => {
    const handler = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !inputRef.current.contains(e.target)
      ) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className={styles.wrapper}>
      <p className={styles.label}>Tags</p>

      {/* Input */}
      <div className={styles.inputWrap}>
        <svg className={styles.searchIcon} xmlns="http://www.w3.org/2000/svg"
             width="13" height="13" viewBox="0 0 24 24"
             fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          ref={inputRef}
          type="text"
          className={styles.input}
          placeholder="Search tags..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setFocused(true)}
        />
      </div>

      {/* Dropdown suggestions */}
      {showDropdown && (
        <div className={styles.dropdown} ref={dropdownRef}>
          {suggestions.map((tag) => (
            <button
              key={tag.name}
              className={styles.suggestion}
              onMouseDown={(e) => {
                e.preventDefault();
                addTag(tag.name);
              }}
            >
              <span className={styles.suggestionHash}>#</span>
              {tag.name}
            </button>
          ))}
        </div>
      )}

      {/* Selected tag bubbles */}
      {selectedTags.length > 0 && (
        <div className={styles.bubbles}>
          {selectedTags.map((name) => (
            <span key={name} className={styles.bubble}>
              <span className={styles.bubbleHash}>#</span>
              {name}
              <button
                className={styles.bubbleRemove}
                onClick={() => removeTag(name)}
                aria-label={`Remove ${name}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagSearch;
