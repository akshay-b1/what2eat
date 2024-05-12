import Link from "next/link"

export default function Navbar() {
    return (
        <header className="bg-gray-900 px-4 py-3 text-white">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">What2Eat</h1>
          <nav>
            <ul className="flex items-center space-x-4">
              <li>
                <Link className="hover:text-gray-400" href="#">
                  About
                </Link>
              </li>
              <li>
                <Link className="hover:text-gray-400" href="#">
                  Plan A New Meal
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    );
    }