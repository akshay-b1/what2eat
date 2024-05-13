import Link from "next/link";
import { useState } from "react";

export default function Component() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="flex flex-col sm:flex-row h-16 w-full items-center justify-between px-4 md:px-6 bg-gray-900 rounded-b-xl">
      <Link className="text-2xl font-semibold text-white sm:text-left text-center" href="/">
        <span className="hidden sm:inline">what2eat 🤤 -- simplify food chaos, respect everyone's tastes</span>
        <span className="sm:hidden">what2eat 🤤</span>
      </Link>
      <div className="sm:flex hidden">
        <Link
          className="inline-flex h-9 items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 dark:bg-gray-950 dark:text-gray-50 dark:hover:bg-gray-800 dark:focus:ring-gray-300"
          href="#"
        >
          About
        </Link>
        <Link
          className="inline-flex h-9 items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50 dark:hover:bg-gray-800 dark:focus:ring-gray-300 ml-4"
          href="/"
        >
          Create New Event
        </Link>
      </div>
      <div className="sm:hidden flex">
        <button
          className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          onClick={toggleMenu}
        >
          <svg
            className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          <svg
            className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div
        className={`${
          isMenuOpen ? "block" : "hidden"
        } sm:hidden absolute top-16 left-0 w-full bg-gray-900 rounded-b-xl shadow-lg z-10`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            href="#"
          >
            About
          </Link>
          <Link
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            href="/"
          >
            Create New Event
          </Link>
        </div>
      </div>
    </header>
  );
}