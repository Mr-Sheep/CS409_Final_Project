import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-900 mb-4">
          Welcome to EventLawnchair
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-600 mb-8">
          Discover, create, and manage events with ease.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/dashboard"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/events"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors"
          >
            Browse Events
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
        <div className="text-center p-6 bg-white rounded-lg shadow-sm">
          <h2 className="dark:text-gray-900 text-xl font-semibold mb-4">
            Create Events
          </h2>
          <p className="text-gray-600">
            Easily create and manage your events with our intuitive interface.
          </p>
        </div>
        <div className="text-center p-6 bg-white rounded-lg shadow-sm">
          <h2 className="dark:text-gray-900 text-xl font-semibold mb-4">
            Weather Updates
          </h2>
          <p className="text-gray-600 dark:text-gray-600">
            Get real-time weather forecasts for your event locations.
          </p>
        </div>
        <div className="text-center p-6 bg-white rounded-lg shadow-sm">
          <h2 className="dark:text-gray-900 text-xl font-semibold mb-4">
            Location Mapping
          </h2>
          <p className="text-gray-600 dark:text-gray-600">
            Interactive maps to help attendees find your events easily.
          </p>
        </div>
      </section>
    </div>
  );
}
