"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import QRCodeGenerator from "@/app/components/QRCodeGenerator";
import { FaRegCalendarCheck, FaLocationDot } from "react-icons/fa6";
import MapDisplay from "@/app/components/MapDisplay";
import WeatherWidget from "@/app/components/WeatherWidget";

interface Event {
  _id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  location: {
    address: string;
    full_address: string;
    latitude: number;
    longitude: number;
    mapbox_id: string;
  };
  weather: string;
  creator: string;
  creatorUsername: string;
}

interface UserProfile {
  id: string;
  username: string;
}

// fixed using https://github.com/vercel/next.js/issues/71690#issuecomment-2439644682
interface Params {
  id: string;
}

export default function EventDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const { id } = use(params);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        // console.log(`no token available, break`);
        return;
      }
      try {
        const response = await fetch("http://localhost:4000/api/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserProfile({
            id: data.id || data._id,
            username: data.username,
          });
        }
      } catch (error) {
        console.error(`failed to fetch user profile: ${error}`);
      }
    };
    fetchUserProfile();
  }, []);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:4000/api/events/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch event details");
        }

        const data = await response.json();
        setEvent(data);

        if (token && userProfile?.id === data.creator) {
          setIsOwner(true);
        }
      } catch (err) {
        setError("Failed to load event details.");
        console.error("Error fetching event:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id, userProfile]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this event?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:4000/api/events/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete event");
      }

      router.push("/events");
    } catch (err) {
      setError("Failed to delete event. Please try again.");
      console.error("Error deleting event:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-gray-600">Loading event details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Event Not Found
        </h1>
        <p className="text-gray-600 mb-6">
          The event you are looking for does not exist or has been removed.
        </p>
        <Link href="/events" className="text-blue-600 hover:text-blue-700">
          Back to All Events
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold text-gray-900">{event.name}</h1>
            {isOwner && (
              <div className="flex gap-4">
                <Link
                  href={`/events/${event._id}/edit`}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Edit Event
                </Link>
                <button
                  onClick={handleDelete}
                  className="text-red-600 hover:text-red-700"
                >
                  Delete Event
                </button>
              </div>
            )}
          </div>
          {event.creator && (
            <p className="text-gray-500 mt-2">
              Created by {event.creatorUsername}
            </p>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Description
            </h2>
            <p className="text-gray-600 whitespace-pre-line">
              {event.description}
            </p>
            <QRCodeGenerator eventId={event._id} eventName={event.name} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Date & Time
              </h2>
              <div className="flex items-center text-gray-600">
                <FaRegCalendarCheck />
                <span className="px-1">
                  {new Date(event.date).toLocaleDateString()} at{" "}
                  {new Date(event.date).toLocaleTimeString()}
                </span>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Location
              </h2>
              <div className="flex text-gray-600">
                <FaLocationDot />
                <div className="px-1">
                  <p>{event.location.address}</p>
                  <p className="py-2 mb-4">{event.location.full_address}</p>
                </div>
              </div>
              <Link
                href={`http://maps.apple.com/?q=${event.location.address.replace(
                  / /g,
                  "+"
                )}&sll=${event.location.latitude},${event.location.longitude}`}
                className="bg-blue-600 text-white px-4 ml-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Open in Maps
              </Link>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Weather
              </h2>
              <WeatherWidget
                coordinates={[
                  event.location.latitude,
                  event.location.longitude,
                ]}
                dateTime={event.date}
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Map</h2>
              <MapDisplay
                coordinates={[
                  event.location.latitude,
                  event.location.longitude,
                ]}
              />
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t">
          <Link href="/events" className="text-blue-600 hover:text-blue-700">
            ← Back to All Events
          </Link>
        </div>
      </div>
    </div>
  );
}
