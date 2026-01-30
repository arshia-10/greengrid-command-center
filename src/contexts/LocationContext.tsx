import React, { createContext, useContext, useState, useEffect } from "react";

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface LocationData {
  city: string;
  country?: string;
  coordinates: LocationCoordinates;
}

interface LocationContextType {
  selectedLocation: LocationData | null;
  setSelectedLocation: (location: LocationData) => void;
  isLocationSet: boolean;
  clearLocation: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedLocation, setSelectedLocationState] = useState<LocationData | null>(() => {
    // Hydrate from localStorage
    const stored = localStorage.getItem("greengrid_selected_location");
    return stored ? JSON.parse(stored) : null;
  });

  const setSelectedLocation = (location: LocationData) => {
    setSelectedLocationState(location);
    localStorage.setItem("greengrid_selected_location", JSON.stringify(location));
  };

  const clearLocation = () => {
    setSelectedLocationState(null);
    localStorage.removeItem("greengrid_selected_location");
  };

  return (
    <LocationContext.Provider
      value={{
        selectedLocation,
        setSelectedLocation,
        isLocationSet: !!selectedLocation,
        clearLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};
