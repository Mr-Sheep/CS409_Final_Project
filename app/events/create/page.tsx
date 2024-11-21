"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import EventForm from "../../components/EventForm";
/* eslint-disable  @typescript-eslint/no-explicit-any */

interface UserProfile {
  id: string;
  username: string;
}

export default function CreateEventPage() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/auth/login");
    }

    fetchUserProfile(token);
  }, [router]);

  const fetchUserProfile = async (token: string | null) => {
    if (!token) {
      console.error(`no token available, break`);
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/api/user/profile", {
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
    } catch (err: any) {
      console.error(`failed to fetch user profile: ${err.message}`);
    }
  };

  const handleCreateEvent = async (formData: any) => {
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
      creator: userProfile.id,
      creatorUsername: userProfile.username,
    };

    console.log("Sending event payload:", eventPayload);

    const response = await fetch("http://localhost:5000/api/events", {
      method: "POST",
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

  // https://stackoverflow.com/questions/10211145/getting-current-date-and-time-in-javascript
  const now = new Date();
  const localNow = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  const currentDate = localNow.toISOString().split("T")[0];
  const currentTime = localNow.toISOString().split("T")[1].slice(0, 5);

  const initialData = {
    name: "",
    description: "",
    date: currentDate,
    time: currentTime,
    location: {
      address: "",
      full_address: "",
      latitude: 0,
      longitude: 0,
      mapbox_id: "",
    },
    creator: "",
    creatorUsername: "",
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Create New Event</h1>
        <p className="text-gray-600 mt-2">
          Fill in the details below to create your event.
        </p>
      </div>

      <EventForm initialData={initialData} onSubmit={handleCreateEvent} />
    </div>
  );
}
