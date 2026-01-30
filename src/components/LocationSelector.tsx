import { useState } from "react";
import { Search, MapPin, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "@/contexts/LocationContext";
import { geocodeCity } from "@/lib/weatherService";

// Popular cities with known coordinates for quick selection
const POPULAR_CITIES = [
  { city: "New York", latitude: 40.7128, longitude: -74.006 },
  { city: "Los Angeles", latitude: 34.0522, longitude: -118.2437 },
  { city: "London", latitude: 51.5074, longitude: -0.1278 },
  { city: "Tokyo", latitude: 35.6762, longitude: 139.6503 },
  { city: "Sydney", latitude: -33.8688, longitude: 151.2093 },
  { city: "Paris", latitude: 48.8566, longitude: 2.3522 },
  { city: "Toronto", latitude: 43.6629, longitude: -79.3957 },
  { city: "Berlin", latitude: 52.52, longitude: 13.405 },
  { city: "Mumbai", latitude: 19.076, longitude: 72.8776 },
  { city: "Singapore", latitude: 1.3521, longitude: 103.8198 },
];

interface LocationSelectorProps {
  onClose?: () => void;
  compact?: boolean;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({ onClose, compact = false }) => {
  const { setSelectedLocation, selectedLocation } = useLocation();
  const [searchInput, setSearchInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSelectCity = async (cityName: string, coords?: { latitude: number; longitude: number }) => {
    setIsSearching(true);
    try {
      let location = coords;

      if (!location) {
        const coordinates = await geocodeCity(cityName);
        if (!coordinates) {
          console.error("City not found");
          setIsSearching(false);
          return;
        }
        location = coordinates;
      }

      setSelectedLocation({
        city: cityName,
        coordinates: location,
      });

      setSearchInput("");
      setShowDropdown(false);
      onClose?.();
    } catch (error) {
      console.error("Error selecting city:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    await handleSelectCity(searchInput.trim());
  };

  const filteredCities = POPULAR_CITIES.filter((c) =>
    c.city.toLowerCase().includes(searchInput.toLowerCase())
  );

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Select a city..."
            value={selectedLocation?.city || ""}
            readOnly
            className="pl-8 cursor-pointer"
            onClick={() => setShowDropdown(!showDropdown)}
          />
          <MapPin className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-sidebar border border-white/10 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
              {POPULAR_CITIES.map((city) => (
                <button
                  key={city.city}
                  onClick={() => handleSelectCity(city.city, city)}
                  className="w-full text-left px-4 py-2 hover:bg-white/5 transition-colors text-sm flex items-center gap-2"
                >
                  <MapPin className="h-4 w-4 text-primary" />
                  {city.city}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold mb-3">Select Your Location</h2>
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="text"
            placeholder="Search for a city..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-1"
            disabled={isSearching}
          />
          <Button
            type="submit"
            disabled={isSearching}
            variant="default"
            className="px-6"
          >
            {isSearching ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-3">Or choose from popular cities:</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {POPULAR_CITIES.map((city) => (
            <Button
              key={city.city}
              variant="glass"
              className="h-auto py-2"
              onClick={() => handleSelectCity(city.city, city)}
              disabled={isSearching}
            >
              <MapPin className="h-3 w-3 mr-1" />
              {city.city}
            </Button>
          ))}
        </div>
      </div>

      {selectedLocation && (
        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
          <p className="text-sm">
            <strong>Selected:</strong> {selectedLocation.city}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {selectedLocation.coordinates.latitude.toFixed(4)},
            {selectedLocation.coordinates.longitude.toFixed(4)}
          </p>
        </div>
      )}
    </div>
  );
};
