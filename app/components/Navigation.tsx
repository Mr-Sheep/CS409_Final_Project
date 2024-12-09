"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // https://curity.medium.com/best-practices-for-storing-access-tokens-in-the-browser-6b3d515d9814
    // https://stackoverflow.com/questions/67872363/how-to-check-the-token-in-localstorage-is-valid-or-not
    const checkLogin = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    checkLogin();

    const handleStorageUpdate = () => {
      checkLogin();
    };

    window.addEventListener("storage", handleStorageUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageUpdate);
    };
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/");
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-blue-600">
            EventLawnchair
          </Link>

          <div className="flex gap-6 items-center">
            <Link
              href="/events"
              className={`text-gray-600 hover:text-gray-900 ${
                pathname === "/events" ? "text-gray-900" : ""
              }`}
            >
              Events
            </Link>

            {isLoggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className={`text-gray-600 hover:text-gray-900 ${
                    pathname === "/dashboard" ? "text-gray-900" : ""
                  }`}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className={`text-gray-600 hover:text-gray-900 ${
                    pathname === "/auth/login" ? "text-gray-900" : ""
                  }`}
                >
                  Log In
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
