"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "something";

interface MapDisplayProps {
  address: string;
  className?: string;
}

export default function MapDisplay({
  address,
  className = "",
}: MapDisplayProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const geocodeAddress = async () => {
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            address
          )}.json?access_token=${mapboxgl.accessToken}`
        );

        if (!response.ok) {
          throw new Error("Failed to geocode address");
        }

        const data = await response.json();
        if (data.features && data.features.length > 0) {
          const [lng, lat] = data.features[0].center;
          setCoordinates([lng, lat]);
        } else {
          setError("Location not found");
        }
      } catch (err) {
        console.error("Geocoding error:", err);
        setError("Failed to load map location");
      }
    };

    if (address) {
      geocodeAddress();
    }
  }, [address]);

  useEffect(() => {
    if (!mapContainer.current || !coordinates) return;

    // Initialize map only once
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: coordinates,
        zoom: 14,
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
    } else {
      // Just update the center if map already exists
      map.current.setCenter(coordinates);
    }

    // Update or create marker
    if (!marker.current) {
      marker.current = new mapboxgl.Marker()
        .setLngLat(coordinates)
        .addTo(map.current);
    } else {
      marker.current.setLngLat(coordinates);
    }

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      marker.current = null;
    };
  }, [coordinates]);

  return (
    <div className={`relative ${className}`}>
      <div
        ref={mapContainer}
        className="w-full h-[300px] rounded-lg overflow-hidden"
      />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-90 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}
