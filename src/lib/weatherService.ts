import { LocationCoordinates } from "@/contexts/LocationContext";

export interface WeatherData {
  temperature: number; // Celsius
  humidity: number; // 0-100
  windSpeed: number; // m/s
  feelsLike: number; // Celsius
  description: string;
  icon: string;
}

export interface AirQualityData {
  aqi: number; // 0-500
  pm25: number; // µg/m³
  pm10: number; // µg/m³
  o3: number; // µg/m³
  no2: number; // µg/m³
  so2: number; // µg/m³
  co: number; // µg/m³
  status: "good" | "fair" | "moderate" | "poor" | "very-poor";
}

const OPENWEATHER_API_KEY = "e41f6f971e64bff7b86c79bc23e5df0e"; // Free tier key (limited to demo)
const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"; // Free, no key required

/**
 * Fetch weather data from Open-Meteo (free, no API key required)
 */
export const fetchWeatherData = async (coords: LocationCoordinates): Promise<WeatherData | null> => {
  try {
    const params = new URLSearchParams({
      latitude: coords.latitude.toString(),
      longitude: coords.longitude.toString(),
      current: "temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,apparent_temperature",
      timezone: "auto",
    });

    const response = await fetch(`${OPEN_METEO_URL}?${params}`);
    if (!response.ok) throw new Error("Weather fetch failed");

    const data = await response.json();
    const current = data.current;

    // Map weather codes to descriptions
    const weatherDescription = getWeatherDescription(current.weather_code);

    return {
      temperature: Math.round(current.temperature_2m),
      humidity: current.relative_humidity_2m,
      windSpeed: Math.round(current.wind_speed_10m * 10) / 10,
      feelsLike: Math.round(current.apparent_temperature),
      description: weatherDescription,
      icon: getWeatherIcon(current.weather_code),
    };
  } catch (error) {
    console.error("Error fetching weather:", error);
    return null;
  }
};

/**
 * Fetch air quality data from Open-Meteo Air Quality API (free)
 */
export const fetchAirQualityData = async (coords: LocationCoordinates): Promise<AirQualityData | null> => {
  try {
    const params = new URLSearchParams({
      latitude: coords.latitude.toString(),
      longitude: coords.longitude.toString(),
      current: "pm10,pm2_5,ozone,nitrogen_dioxide,sulphur_dioxide,carbon_monoxide,us_aqi",
      timezone: "auto",
    });

    const response = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?${params}`);
    if (!response.ok) throw new Error("Air quality fetch failed");

    const data = await response.json();
    const current = data.current;

    // US AQI values: 0-50 (good), 51-100 (fair), 101-150 (moderate), 151-200 (poor), 200+ (very poor)
    const aqi = current.us_aqi || 50;
    const status = getAQIStatus(aqi);

    return {
      aqi: Math.round(aqi),
      pm25: Math.round(current.pm2_5 * 10) / 10,
      pm10: Math.round(current.pm10 * 10) / 10,
      o3: Math.round(current.ozone * 10) / 10,
      no2: Math.round(current.nitrogen_dioxide * 10) / 10,
      so2: Math.round(current.sulphur_dioxide * 10) / 10,
      co: Math.round(current.carbon_monoxide * 10) / 10,
      status,
    };
  } catch (error) {
    console.error("Error fetching air quality:", error);
    return null;
  }
};

/**
 * Get city coordinates from city name (using Open-Meteo Geocoding API, free)
 */
export const geocodeCity = async (cityName: string): Promise<LocationCoordinates | null> => {
  try {
    const params = new URLSearchParams({
      name: cityName,
      count: "1",
      language: "en",
      format: "json",
    });

    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params}`);
    if (!response.ok) throw new Error("Geocoding failed");

    const data = await response.json();
    if (!data.results || data.results.length === 0) {
      return null;
    }

    const result = data.results[0];
    return {
      latitude: result.latitude,
      longitude: result.longitude,
    };
  } catch (error) {
    console.error("Error geocoding city:", error);
    return null;
  }
};

/**
 * Fetch both weather and air quality data in parallel
 */
export const fetchEnvironmentalData = async (
  coords: LocationCoordinates
): Promise<{ weather: WeatherData | null; airQuality: AirQualityData | null }> => {
  const [weather, airQuality] = await Promise.all([
    fetchWeatherData(coords),
    fetchAirQualityData(coords),
  ]);

  return { weather, airQuality };
};

// Helper functions
function getWeatherDescription(code: number): string {
  const descriptions: { [key: number]: string } = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
  };
  return descriptions[code] || "Unknown";
}

function getWeatherIcon(code: number): string {
  if (code === 0) return "☀️";
  if (code === 1 || code === 2) return "🌤️";
  if (code === 3) return "☁️";
  if (code === 45 || code === 48) return "🌫️";
  if (code >= 51 && code <= 67) return "🌧️";
  if (code >= 71 && code <= 86) return "❄️";
  if (code >= 95 && code <= 99) return "⛈️";
  return "🌡️";
}

function getAQIStatus(aqi: number): AirQualityData["status"] {
  if (aqi <= 50) return "good";
  if (aqi <= 100) return "fair";
  if (aqi <= 150) return "moderate";
  if (aqi <= 200) return "poor";
  return "very-poor";
}

/**
 * Get AQI color based on status
 */
export const getAQIColor = (status: AirQualityData["status"]): string => {
  const colors: { [key in AirQualityData["status"]]: string } = {
    good: "text-primary",
    fair: "text-yellow-500",
    moderate: "text-orange-500",
    poor: "text-red-500",
    "very-poor": "text-red-700",
  };
  return colors[status];
};

/**
 * Get AQI color background based on status
 */
export const getAQIBgColor = (status: AirQualityData["status"]): string => {
  const colors: { [key in AirQualityData["status"]]: string } = {
    good: "bg-primary/10",
    fair: "bg-yellow-500/10",
    moderate: "bg-orange-500/10",
    poor: "bg-red-500/10",
    "very-poor": "bg-red-700/10",
  };
  return colors[status];
};
