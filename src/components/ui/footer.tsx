
import Link from "next/link"

export default function Component() {
  return (
    <footer className="bg-gray-900 px-4 py-3 text-white">
        <div className="container mx-auto flex items-center justify-between">
          <p>© 2024 What2Eat. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <Link className="hover:text-gray-400" href="#">
              Privacy Policy
            </Link>
            <Link className="hover:text-gray-400" href="#">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
  )
}