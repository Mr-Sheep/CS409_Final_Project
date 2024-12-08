"use client";

import { EventCardProps } from "../lib/types";
import { FaRegCalendarCheck, FaLocationDot, FaUser } from "react-icons/fa6";
import Link from "next/link";

export default function EventCard({ event, onDelete }: EventCardProps) {
  const formattedDate = new Date(event.date).toLocaleDateString();
  const formattedTime = new Date(event.date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <Link href={`/events/${event._id}`}>
            <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600">
              {event.name}
            </h3>
          </Link>
          {onDelete && (
            <button
              onClick={() => onDelete(event._id)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Delete
            </button>
          )}
        </div>

        <p className="text-gray-600">{event.description}</p>

        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <FaRegCalendarCheck />
            <span>
              {formattedDate} at {formattedTime}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <FaLocationDot />
            <span>{event.location.address}</span>
          </div>

          {event.creatorUsername && (
            <div className="flex items-center gap-2">
              <FaUser />
              <span>Created by {event.creatorUsername}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
