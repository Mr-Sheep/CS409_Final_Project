"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EventCard from "../components/EventCard";
import EventForm from "../components/EventForm";

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

interface FormData {
  name: string;
  description: string;
  date: string;
  time: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
    mapbox_id: string;
  };
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
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

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
          `http://localhost:5000/api/events/user/${userProfile.username}`,
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
        setError("Failed to load your events. Please try again later.");
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
        `http://localhost:5000/api/events/${eventId}`,
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

  const handleUpdate = async (formData: FormData) => {
    if (!editingEvent || !userProfile) return;

    try {
      const token = localStorage.getItem("token");

      const dateTime = new Date(
        `${formData.date}T${formData.time}`
      ).toISOString();

      const updatePayload = {
        name: formData.name,
        description: formData.description,
        date: dateTime,
        location: formData.location,
      };

      const response = await fetch(
        `http://localhost:5000/api/events/${editingEvent._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatePayload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update event");
      }

      const updatedEvent = await response.json();
      setEvents(
        events.map((event) =>
          event._id === editingEvent._id ? updatedEvent : event
        )
      );
      setEditingEvent(null);
    } catch (err) {
      console.error("Error updating event:", err);
      setError("Failed to update event. Please try again.");
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
        <p>
          Welcome to your personal dashboard, here you can create new events, or
          delete your old events
        </p>
      </div>
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {editingEvent ? (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Edit Event</h2>
            <button
              onClick={() => setEditingEvent(null)}
              className="text-gray-600 hover:text-gray-900"
            >
              Cancel Editing
            </button>
          </div>
          <EventForm
            initialData={{
              name: editingEvent.name,
              description: editingEvent.description,
              date: new Date(editingEvent.date).toISOString().split("T")[0],
              time: new Date(editingEvent.date).toTimeString().slice(0, 5),
              location: editingEvent.location,
            }}
            onSubmit={handleUpdate}
            submitLabel="Update Event"
          />
        </div>
      ) : (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">My Events</h2>
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
            <div className="space-y-6">
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
      )}
    </div>
  );
}
