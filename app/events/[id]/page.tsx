"use client";
export const dynamic = "force-dynamic";

import { API_BASE_URL } from "@/app/api/config";
import { Event, UserProfile, EventParticipant } from "@/app/lib/types";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import QRCodeGenerator from "@/app/components/QRCodeGenerator";
import { FaRegCalendarCheck, FaLocationDot } from "react-icons/fa6";
import MapDisplay from "@/app/components/MapDisplay";
import WeatherWidget from "@/app/components/WeatherWidget";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [isJoined, setIsJoined] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const { id } = use(params);
  const [participants, setparticipants] = useState<EventParticipant | null>(
    null
  );

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        // console.log(`no token available, break`);
        return;
      }
      try {
        const response = await fetch(`${API_BASE_URL}/user/profile`, {
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

        const response = await fetch(`${API_BASE_URL}/events/${id}`, {
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

    const joinStatus = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/user/event/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to join event");
        }

        const data = await response.json();

        setIsJoined(data?.joined || false);
      } catch (error) {
        console.error(`failed to check event: ${error}`);
      }
    };

    const fetchParticipants = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/events/${id}/participants`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch participants");
        }

        const data = await response.json();
        console.log(response);
        const p = Array.isArray(data) ? data : [data];

        setparticipants({
          participants: p,
        });
      } catch (error) {
        console.error("Error fetching participants:", error);
      }
    };

    fetchEventDetails();
    joinStatus();
    if (userProfile) fetchParticipants();
  }, [id, userProfile]);

  const fetchParticipants = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/events/${id}/participants`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch participants");
      }

      const data = await response.json();
      console.log(response);
      const p = Array.isArray(data) ? data : [data];

      setparticipants({
        participants: p,
      });
    } catch (error) {
      console.error("Error fetching participants:", error);
    }
  };

  const handleJoin = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/user/join/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to join event");
      }

      toast.success("Successfully joined the event!");
      setIsJoined(true);
      fetchParticipants();
    } catch (error) {
      console.error(`failed to join event: ${error}`);
    }
  };

  const handleLeave = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/user/leave/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to leaf event");
      }

      toast.success("Successfully left the event!");
      setIsJoined(false);
      fetchParticipants();
    } catch (error) {
      console.error(`failed to leave event: ${error}`);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this event?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/events/${id}`, {
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
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  className="text-red-600 hover:text-red-700"
                >
                  Delete
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
              {userProfile && (
                <button
                  onClick={isJoined ? handleLeave : handleJoin}
                  className={`${
                    isJoined
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  } text-white px-4 mt-4 py-2 rounded-lg transition-colors`}
                >
                  {isJoined ? "Leave" : "Join"}
                </button>
              )}
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
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Participants
              </h2>
              {userProfile && participants && (
                <div>
                  {participants.participants.length === 0 ? (
                    <p className="text-gray-600">No participants yet.</p>
                  ) : (
                    <ul className="list-disc pl-5">
                      {participants.participants.map(
                        (participant: { username: string }, index: number) => (
                          <li key={index} className="text-gray-600">
                            {participant.username}
                          </li>
                        )
                      )}
                    </ul>
                  )}
                </div>
              )}

              {!userProfile && (
                <div className="bg-red-100 text-red-700 p-4 rounded">
                  <p>Please log in to see the list of participants</p>
                </div>
              )}
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
