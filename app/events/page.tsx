"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import EventCard from "../components/EventCard";

interface Event {
  _id: string;
  name: string;
  description: string;
  date: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
    mapbox_id: string;
  };
  creator: string;
  creatorUsername: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/events", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }

        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError("Failed to load events. Please try again later.");
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-gray-600">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">All Events</h1>
        {localStorage.getItem("token") && (
          <Link
            href="/events/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Event
          </Link>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {events.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No events found.</p>
          <p className="text-gray-500">
            {localStorage.getItem("token")
              ? "Why not create one?"
              : "Please log in to create events."}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
