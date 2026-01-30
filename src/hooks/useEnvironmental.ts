import { useState, useEffect, useCallback } from "react";
import { useLocation } from "@/contexts/LocationContext";
import {
  fetchWeatherData,
  fetchAirQualityData,
  fetchEnvironmentalData,
  WeatherData,
  AirQualityData,
} from "@/lib/weatherService";

interface UseDataFetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook to fetch weather data for selected location
 * Refreshes on location change and can be manually refreshed
 */
export const useWeather = () => {
  const { selectedLocation } = useLocation();
  const [state, setState] = useState<UseDataFetchState<WeatherData>>({
    data: null,
    loading: false,
    error: null,
  });

  const refetch = useCallback(async () => {
    if (!selectedLocation) {
      setState({ data: null, loading: false, error: "No location selected" });
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await fetchWeatherData(selectedLocation.coordinates);
      if (data) {
        setState({ data, loading: false, error: null });
      } else {
        setState({ data: null, loading: false, error: "Failed to fetch weather data" });
      }
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }, [selectedLocation]);

  useEffect(() => {
    refetch();
  }, [selectedLocation, refetch]);

  return { ...state, refetch };
};

/**
 * Hook to fetch air quality data for selected location
 * Refreshes on location change and can be manually refreshed
 */
export const useAirQuality = () => {
  const { selectedLocation } = useLocation();
  const [state, setState] = useState<UseDataFetchState<AirQualityData>>({
    data: null,
    loading: false,
    error: null,
  });

  const refetch = useCallback(async () => {
    if (!selectedLocation) {
      setState({ data: null, loading: false, error: "No location selected" });
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await fetchAirQualityData(selectedLocation.coordinates);
      if (data) {
        setState({ data, loading: false, error: null });
      } else {
        setState({ data: null, loading: false, error: "Failed to fetch air quality data" });
      }
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }, [selectedLocation]);

  useEffect(() => {
    refetch();
  }, [selectedLocation, refetch]);

  return { ...state, refetch };
};

/**
 * Hook to fetch both weather and air quality data in parallel
 * Returns both datasets along with combined loading/error states
 */
export const useEnvironmentalData = () => {
  const { selectedLocation } = useLocation();
  const [state, setState] = useState<{
    weather: WeatherData | null;
    airQuality: AirQualityData | null;
    loading: boolean;
    error: string | null;
  }>({
    weather: null,
    airQuality: null,
    loading: false,
    error: null,
  });

  const refetch = useCallback(async () => {
    if (!selectedLocation) {
      setState((prev) => ({ ...prev, loading: false, error: "No location selected" }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const { weather, airQuality } = await fetchEnvironmentalData(selectedLocation.coordinates);
      setState({
        weather,
        airQuality,
        loading: false,
        error: !weather || !airQuality ? "Failed to fetch some data" : null,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }));
    }
  }, [selectedLocation]);

  useEffect(() => {
    refetch();
  }, [selectedLocation, refetch]);

  return { ...state, refetch };
};

/**
 * Hook to calculate "City Green Health Score" based on environmental data
 * Score calculation:
 * - Air Quality: 0-100 (lower AQI = higher score)
 * - Base score from weather (temperature, humidity optimal ranges)
 * - User impact from simulations and reports
 */
export const useGreenHealthScore = () => {
  const { selectedLocation } = useLocation();
  const weather = useWeather();
  const airQuality = useAirQuality();
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    if (!selectedLocation || !weather.data || !airQuality.data) {
      setScore(null);
      return;
    }

    // Calculate base environmental score (0-100)
    // AQI: 0-100 is good (100 points), 100-150 is moderate (75 points), etc.
    const aqiScore = Math.max(0, 100 - (airQuality.data.aqi - 50) * 0.5);

    // Weather score (optimal: 20-25°C, 40-60% humidity)
    const tempScore = Math.max(0, 100 - Math.abs(weather.data.temperature - 22.5) * 2);
    const humidityScore = Math.max(0, 100 - Math.abs(weather.data.humidity - 50) * 1);

    // Combined environmental score
    const environmentalScore = (aqiScore * 0.5 + tempScore * 0.25 + humidityScore * 0.25) / 100;

    // For now, return just environmental score
    // In production, this would also factor in user simulations and reports
    const finalScore = Math.round(environmentalScore * 100);
    setScore(Math.min(100, Math.max(0, finalScore)));
  }, [selectedLocation, weather.data, airQuality.data]);

  return score;
};
