"use client";

import { API_BASE_URL } from "@/app/api/config";
import { UserProfile } from "@/app/lib/types";
import dynamic from "next/dynamic";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
/* eslint-disable  @typescript-eslint/no-explicit-any */

const EventForm = dynamic(() => import("../../../components/EventForm"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center min-h-[50vh]">
      <div className="text-gray-600">Loading form...</div>
    </div>
  ),
});

export default function CreateEventPage() {
  const router = useRouter();
  const params = useParams();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id } = params;
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
    }

    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }
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

    const fetchEventDetails = async (eventId: string, token: string | null) => {
      try {
        const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const date = new Date(data.date);
          const formattedDate = date.toISOString().split("T")[0];
          const formattedTime = date.toISOString().split("T")[1].slice(0, 5);

          setInitialData({
            name: data.name,
            description: data.description,
            date: formattedDate,
            time: formattedTime,
            location_note: data.location_note,
            location: data.location,
            creator: data.creator,
            creatorUsername: data.creatorUsername,
          });
        } else {
          console.error("Failed to fetch event details");
        }
      } catch (err: any) {
        console.error(`Failed to fetch event details: ${err.message}`);
      }
    };

    fetchUserProfile();
    const eventId = Array.isArray(id) ? id[0] : id;

    if (eventId) {
      console.log(eventId);
      fetchEventDetails(eventId, token);
    } else {
      // https://stackoverflow.com/questions/10211145/getting-current-date-and-time-in-javascript
      const now = new Date();
      const localNow = new Date(
        now.getTime() - now.getTimezoneOffset() * 60000
      );
      const currentDate = localNow.toISOString().split("T")[0];
      const currentTime = localNow.toISOString().split("T")[1].slice(0, 5);

      setInitialData({
        name: "",
        description: "",
        date: currentDate,
        time: currentTime,
        location_note: "",
        location: {
          address: "",
          full_address: "",
          latitude: 0,
          longitude: 0,
          mapbox_id: "",
        },
        creator: "",
        creatorUsername: "",
      });
    }
  }, [id, isClient, router]);

  const handleUpdateEvent = async (formData: any) => {
    if (!isClient) return;
    const token = localStorage.getItem("token");
    if (!token || !userProfile) {
      throw new Error("You must be logged in to create events");
    }

    const dateTime = new Date(
      `${formData.date}T${formData.time}`
    ).toISOString();

    if (!userProfile.username) {
      throw new Error("User profile not properly loaded");
    }

    const eventPayload = {
      name: formData.name,
      description: formData.description,
      date: dateTime,
      location: formData.location,
      location_note: formData.location_note,
    };

    // console.log("Sending event payload:", eventPayload);

    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(eventPayload),
    });

    if (!response.ok) {
      const error = await response.json();
      console.log(error.message);
      throw new Error(error.message || "Failed to create event");
    }

    router.back();
  };

  if (!isClient || !initialData) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Your Event</h1>
        <p className="text-gray-600 mt-2">
          Fill in the details below to create your event.
        </p>
      </div>

      <EventForm
        initialData={initialData}
        onSubmit={handleUpdateEvent}
        submitLabel="Edit Event"
      />
    </div>
  );
}
