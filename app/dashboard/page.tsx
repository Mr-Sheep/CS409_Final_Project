"use client";

import { API_BASE_URL } from "@/app/api/config";
import { Event, UserProfile } from "../lib/types";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ToggleBar from "../components/ToggleBar";
// import EventForm from "../components/EventForm";

const EventCard = dynamic(() => import("../components/EventCard"), {
  ssr: false,
});

const isFuture = (event: Event): boolean => {
  const now = new Date();
  const eventDate = new Date(event.date);
  return eventDate > now;
};

export default function DashboardPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [joinedEvents, setJoinedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showAll, setShowAll] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [showFilterJoined, setShowFilterJoined] = useState(false);
  const [showAllJoined, setShowAllJoined] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const data = await response.json();
        setUserProfile({
          id: data._id,
          username: data.username,
        });
      } catch (err) {
        console.error("Error fetching user profile:", err);
        router.push("/auth/login");
      }
    };

    fetchUserProfile();
  }, [router]);

  useEffect(() => {
    if (!userProfile) return;

    const fetchUserEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/user/events`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }

        const data = await response.json();

        const dispalyEvents = showAll ? data : data.filter(isFuture);

        setEvents(dispalyEvents);
      } catch (err) {
        setError("Failed to load your events.");
        console.error("Error fetching user events:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserJoinedEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/user/events/joined`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }

        const data = await response.json();

        const dispalyEvents = showAllJoined ? data : data.filter(isFuture);

        setJoinedEvents(dispalyEvents);
      } catch (err) {
        setError("Failed to load your joined events.");
        console.error("Error fetching user joined events:", err);
      }
    };

    fetchUserEvents();
    fetchUserJoinedEvents();
  }, [userProfile, router, showAll, showAllJoined]);

  const handleDelete = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete event");
      }

      setEvents(events.filter((event) => event._id !== eventId));
    } catch (err) {
      console.error("Error deleting event:", err);
      setError("Failed to delete event. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-gray-600">Loading your events...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">My Dashboard</h1>
      <h2 className="text-xl font-bold text-gray-800 mb-8">
        Hello {userProfile?.username}!
      </h2>
      <div className="text-gray-800 mb-8">
        <p className="mb-4">
          Welcome to your personal dashboard, here you can create new events, or
          delete your old events
        </p>

        <Image
          src="/time_management.png"
          width={315}
          height={140}
          alt="xkcd: Time Management"
        />
      </div>
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-gray-600 text-xl font-semibold mb-4">My Events</h2>
        <Link
          href="/events/create"
          className="bg-blue-600 text-white px-4 py-2 mb-10 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Event
        </Link>

        {!showFilter && (
          <button
            onClick={() => setShowFilter(true)}
            className="flex items-center mb-8 mt-4"
          >
            <span>Show Filter</span>
          </button>
        )}

        {showFilter && (
          <div className="flex items-start flex-col mb-8 mt-4">
            <div className="controls items-start flex">
              <span>Hide Past Events: </span>
              <ToggleBar
                value={!showAll}
                onChange={() => setShowAll(!showAll)}
              />
            </div>
            <button
              className="text-gray-500"
              onClick={() => setShowFilter(!showFilter)}
            >
              Hide Filter
            </button>
          </div>
        )}

        {events.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            {showAll && (
              <div>
                <p className="text-gray-600 mb-4">
                  You have not created any events yet.
                </p>
                <button
                  onClick={() => router.push("/events/create")}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Create your first event
                </button>
              </div>
            )}
            {!showAll && (
              <div>
                <p className="text-gray-600 mb-4">
                  You have not created any future events yet.
                </p>
                <button
                  onClick={() => router.push("/events/create")}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Create your first future event
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6 mt-4">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
      <div className="mb-8">
        <h2 className="text-gray-600 text-xl font-semibold mb-4">
          Joined Events
        </h2>
        {!showFilterJoined && (
          <button
            onClick={() => setShowFilterJoined(true)}
            className="flex items-center mb-8 mt-4"
          >
            <span>Show Filter</span>
          </button>
        )}

        {showFilterJoined && (
          <div className="flex items-start flex-col mb-8 mt-4">
            <div className="controls items-start flex">
              <span>Hide Past Events: </span>
              <ToggleBar
                value={!showAllJoined}
                onChange={() => setShowAllJoined(!showAllJoined)}
              />
            </div>
            <button
              className="text-gray-500"
              onClick={() => setShowFilterJoined(!showFilterJoined)}
            >
              Hide Filter
            </button>
          </div>
        )}
        {joinedEvents.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            {showAllJoined && (
              <div>
                <p className="text-gray-600 mb-4">
                  You have not joined any events yet.
                </p>
                <button
                  onClick={() => router.push("/events")}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Checkout the events
                </button>
              </div>
            )}
            {!showAllJoined && (
              <div>
                <p className="text-gray-600 mb-4">
                  You have not joined any future events yet.
                </p>
                <button
                  onClick={() => router.push("/events")}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Checkout the events
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6 mt-4">
            {joinedEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
