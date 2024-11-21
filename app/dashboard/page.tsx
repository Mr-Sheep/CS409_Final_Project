"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
// import EventForm from "../components/EventForm";

const EventCard = dynamic(() => import("../components/EventCard"), {
  ssr: false,
});

interface Event {
  _id: string;
  name: string;
  description: string;
  date: string;
  location_note: string | "";
  location: {
    address: string;
    full_address: string;
    latitude: number;
    longitude: number;
    mapbox_id: string;
  };
  creator: string;
  creatorUsername: string;
}

interface UserProfile {
  _id: string;
  username: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const response = await fetch(
          "https://cs409-final-project-yjnl.onrender.com/api/user/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const data = await response.json();
        setUserProfile({
          _id: data._id,
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
        const response = await fetch(
          `https://cs409-final-project-yjnl.onrender.com/api/events/user/${userProfile.username}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }

        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError("Failed to load your events.");
        console.error("Error fetching user events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserEvents();
  }, [userProfile, router]);

  const handleDelete = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://cs409-final-project-yjnl.onrender.com/api/events/${eventId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

        {events.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
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
    </div>
  );
}
