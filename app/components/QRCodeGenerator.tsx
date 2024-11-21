"use client";

import { QRCodeSVG } from "qrcode.react";
import { FaRegCopy } from "react-icons/fa6";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface QRCodeGeneratorProps {
  eventId: string;
  eventName: string;
  className?: string;
}

export default function QRCodeGenerator({
  eventId,
  className = "",
}: QRCodeGeneratorProps) {
  const eventUrl = `${window.location.origin}/events/${eventId}`;

  /*https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript*/
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(eventUrl);
      toast.success("URL copied!");
    } catch (err) {
      console.error(`failed to copy: ${err}`);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Event QR Code
        </h3>

        <div className="flex justify-center mb-4">
          <QRCodeSVG id="event-qr-code" value={eventUrl} size={200} level="H" />
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">Event URL:</p>
          <div className="flex items-center justify-center gap-2">
            <input
              type="text"
              value={eventUrl}
              readOnly
              className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg w-1/2"
            />
            <button
              onClick={handleCopy}
              className="text-blue-600 hover:text-blue-700 p-2"
              title="Copy URL"
            >
              <FaRegCopy />
            </button>
          </div>
        </div>
      </div>
      <ToastContainer autoClose={1000} closeOnClick transition={Slide} />
    </div>
  );
}
