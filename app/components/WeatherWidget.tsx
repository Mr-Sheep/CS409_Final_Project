"use client";

import { useEffect, useState } from "react";

interface WeatherWidgetProps {
  address: string;
  date: string;
  className?: string;
}

interface WeatherData {
  temperature: number;
  weatherCode: number;
  precipitation: number;
  windSpeed: number;
}

// Weather code mapping based on Open-Meteo codes
const weatherDescriptions: {
  [key: number]: { icon: string; description: string };
} = {
  0: { icon: "☀️", description: "Clear sky" },
  1: { icon: "🌤️", description: "Mainly clear" },
  2: { icon: "⛅", description: "Partly cloudy" },
  3: { icon: "☁️", description: "Overcast" },
  45: { icon: "🌫️", description: "Foggy" },
  48: { icon: "🌫️", description: "Depositing rime fog" },
  51: { icon: "🌧️", description: "Light drizzle" },
  53: { icon: "🌧️", description: "Moderate drizzle" },
  55: { icon: "🌧️", description: "Dense drizzle" },
  61: { icon: "🌧️", description: "Slight rain" },
  63: { icon: "🌧️", description: "Moderate rain" },
  65: { icon: "🌧️", description: "Heavy rain" },
  71: { icon: "🌨️", description: "Slight snow" },
  73: { icon: "🌨️", description: "Moderate snow" },
  75: { icon: "🌨️", description: "Heavy snow" },
  77: { icon: "🌨️", description: "Snow grains" },
  80: { icon: "🌧️", description: "Slight rain showers" },
  81: { icon: "🌧️", description: "Moderate rain showers" },
  82: { icon: "🌧️", description: "Violent rain showers" },
  85: { icon: "🌨️", description: "Slight snow showers" },
  86: { icon: "🌨️", description: "Heavy snow showers" },
  95: { icon: "⛈️", description: "Thunderstorm" },
  96: { icon: "⛈️", description: "Thunderstorm with slight hail" },
  99: { icon: "⛈️", description: "Thunderstorm with heavy hail" },
};

export default function WeatherWidget({
  address,
  date,
  className = "",
}: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // First, geocode the address using Mapbox
        const geocodeResponse = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            address
          )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
        );

        if (!geocodeResponse.ok) {
          throw new Error("Failed to geocode address");
        }

        const geocodeData = await geocodeResponse.json();
        if (!geocodeData.features || geocodeData.features.length === 0) {
          throw new Error("Location not found");
        }

        const [lng, lat] = geocodeData.features[0].center;

        // Format date for Open-Meteo (YYYY-MM-DD)
        const formattedDate = new Date(date).toISOString().split("T")[0];

        // Fetch weather from Open-Meteo
        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?` +
            `latitude=${lat}&longitude=${lng}&` +
            `daily=weathercode,temperature_2m_max,precipitation_sum,windspeed_10m_max&` +
            `timezone=auto&` +
            `start_date=${formattedDate}&end_date=${formattedDate}`
        );

        if (!weatherResponse.ok) {
          throw new Error("Failed to fetch weather data");
        }

        const weatherData = await weatherResponse.json();

        setWeather({
          temperature: weatherData.daily.temperature_2m_max[0],
          weatherCode: weatherData.daily.weathercode[0],
          precipitation: weatherData.daily.precipitation_sum[0],
          windSpeed: weatherData.daily.windspeed_10m_max[0],
        });
      } catch (err) {
        console.error("Weather fetch error:", err);
        setError("Failed to load weather data");
      } finally {
        setLoading(false);
      }
    };

    if (address && date) {
      fetchWeather();
    }
  }, [address, date]);

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm p-4 ${className}`}>
        <div className="animate-pulse space-y-2">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-sm p-4 ${className}`}>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!weather) return null;

  const weatherInfo = weatherDescriptions[weather.weatherCode] || {
    icon: "❓",
    description: "Unknown weather",
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-4xl mr-2">{weatherInfo.icon}</span>
          <span className="text-lg font-medium text-gray-900">
            {weather.temperature}°C
          </span>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">
            {weatherInfo.description}
          </p>
          <p className="text-sm text-gray-500">
            {new Date(date).toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Precipitation</p>
          <p className="font-medium text-gray-900">
            {weather.precipitation} mm
          </p>
        </div>
        <div>
          <p className="text-gray-500">Wind Speed</p>
          <p className="font-medium text-gray-900">{weather.windSpeed} km/h</p>
        </div>
      </div>
    </div>
  );
}
