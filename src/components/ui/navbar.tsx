
import Link from "next/link"

export default function Component() {
  return (
    <header className="flex h-16 w-full items-center justify-between px-4 md:px-6 bg-gray-900 rounded-b-xl">
      <Link className="text-xl font-semibold text-white" href="/">
        what2eat 🤤
      </Link> 
      <div className="flex items-center gap-4">
        <Link
          className="inline-flex h-9 items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 dark:bg-gray-950 dark:text-gray-50 dark:hover:bg-gray-800 dark:focus:ring-gray-300"
          href="#"
        >
          About
        </Link>
        <Link
          className="inline-flex h-9 items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50 dark:hover:bg-gray-800 dark:focus:ring-gray-300"
          href="/"
        >
          Create New Event
        </Link>
      </div>
    </header>
  )
}