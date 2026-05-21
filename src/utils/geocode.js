/**
 * Reverse geocode lat/lng -> readable address
 * Uses OpenStreetMap Nominatim
 */
export const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        {
          headers: {
            "Accept-Language": "en",
          },
        }
      );
  
      const data = await res.json();
      const a = data.address ?? {};
  
      const street = [a.road, a.house_number]
        .filter(Boolean)
        .join(" ");
  
      const city =
        a.city ??
        a.town ??
        a.village ??
        a.county ??
        "";
  
      const country = a.country ?? "";
  
      return {
        street,
        city,
        country,
        displayName: data.display_name ?? "",
        short:
          [street, city]
            .filter(Boolean)
            .join(", ") || data.display_name,
      };
    } catch (e) {
      console.error("Geocoding failed:", e);
      return null;
    }
  };