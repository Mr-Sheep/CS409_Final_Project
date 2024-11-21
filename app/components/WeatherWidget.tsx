"use client";
import { openWeatherWMOToEmoji } from "@akaguny/open-meteo-wmo-to-emoji";
import { useEffect, useState } from "react";
import { fetchWeatherApi } from "openmeteo";

interface WeatherWidgetProp {
  coordinates: [number, number];
  dateTime: string;
}

interface WeatherData {
  date: string;
  weatherCode: number;
  temperatureMax: number;
  temperatureMin: number;
}

const WeatherWidget = ({ coordinates, dateTime }: WeatherWidgetProp) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);

      try {
        const date = new Date(dateTime).toISOString().split("T")[0];
        console.log(date);

        const params = {
          latitude: coordinates[0],
          longitude: coordinates[1],
          daily: ["weather_code", "temperature_2m_max", "temperature_2m_min"],
          temperature_unit: "fahrenheit",
          wind_speed_unit: "mph",
          precipitation_unit: "inch",
          start_date: date,
          end_date: date,
        };

        const url = "https://api.open-meteo.com/v1/forecast";
        const responses = await fetchWeatherApi(url, params);

        const range = (start: number, stop: number, step: number) =>
          Array.from(
            { length: (stop - start) / step },
            (_, i) => start + i * step
          );

        const response = responses[0];
        const utcOffsetSeconds = response.utcOffsetSeconds();

        const daily = response.daily()!;

        const weatherData = {
          daily: {
            time: range(
              Number(daily.time()),
              Number(daily.timeEnd()),
              daily.interval()
            ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
            weatherCode: daily.variables(0)!.valuesArray()!,
            temperature2mMax: daily.variables(1)!.valuesArray()!,
            temperature2mMin: daily.variables(2)!.valuesArray()!,
          },
        };

        console.log(weatherData.daily.time.length);

        const weather: WeatherData = {
          date: weatherData.daily.time[0].toISOString().split("T")[0],
          weatherCode: weatherData.daily.weatherCode[0],
          temperatureMax: weatherData.daily.temperature2mMax[0],
          temperatureMin: weatherData.daily.temperature2mMin[0],
        };
        // console.log(weather);
        setWeatherData(weather);
      } catch (err) {
        console.error("Error fetching weather data:", err);
        setError("Failed to load weather data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [coordinates, dateTime]);

  if (loading) {
    return <div>Loading weather data...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded">
        <p>{error}</p>
      </div>
    );
  }

  if (!weatherData) {
    return null;
  }

  const weatherEmoji = openWeatherWMOToEmoji(weatherData.weatherCode);
  const emojiValue = weatherEmoji.value;
  const description = weatherEmoji.description;

  return (
    <div className="weather-widget bg-blue-50 p-4 rounded shadow">
      <h2 className="text-xl font-bold ">Daily Weather Forecast</h2>
      <p className="text-xs mb-4">powered by open-meteo</p>
      <h3 className="text-xl font-bold mb-4">
        {emojiValue} ({description})
      </h3>

      <p>Date: {weatherData.date}</p>

      <p>High: {weatherData.temperatureMax.toPrecision(2)}°F</p>
      <p>Low: {weatherData.temperatureMin.toPrecision(2)}°F</p>
    </div>
  );
};

export default WeatherWidget;
