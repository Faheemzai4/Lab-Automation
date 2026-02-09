"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Logo from "../../../public/minimalist-lab.png";

interface User {
  _id?: string;
  name: string;
  role: string;
}

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;
  const navLinkClass = (path: string) =>
    `px-3 py-2 rounded-md border-b-2 border-transparent transition font-medium ${
      isActive(path)
        ? "text-yellow-400 border-b-2 border-yellow-400"
        : "text-gray-300 hover:text-white"
    }`;

  return (
    <nav className="bg-gray-900 text-white shadow-md fixed w-full z-50 top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
           <Link href="/dashboard" className="flex items-center">
            <div className="w-[60px] h-[60px] rounded-full overflow-hidden">
              <Image
                src={Logo}
                alt="Logo"
                width={70}
                height={70}
                className="object-cover w-full h-full"
              />
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="/dashboard" className={navLinkClass("/dashboard")}>
              Dashboard
            </Link>

            {user?.role === "Admin" && (
              <>
                <Link href="/products" className={navLinkClass("/products")}>
                  Products
                </Link>
                <Link href="/search" className={navLinkClass("/search")}>
                  Search
                </Link>
                <Link href="/re-manufacturing">Re-Manufacturing</Link>
              </>
            )}

            {user?.role === "Tester" && (
              <Link href="/testing" className={navLinkClass("/testing")}>
                Testing
              </Link>
            )}

            {user?.role === "Manager" && (
              <>
                <Link href="/cpri" className={navLinkClass("/cpri")}>
                  CPRI
                </Link>
                <Link href="/search" className={navLinkClass("/search")}>
                  Search
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onLogout}
              className="bg-red-600 px-4 py-1.5 rounded-md hover:bg-red-700 transition shadow-sm"
            >
              Logout
            </button>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-md hover:bg-gray-800 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor">
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700 px-3 pb-4 space-y-2">
          <Link
            href="/dashboard"
            className={`block ${navLinkClass("/dashboard")}`}
          >
            Dashboard
          </Link>

          {user?.role === "Admin" && (
            <>
              <Link
                href="/products"
                className={`block ${navLinkClass("/products")}`}
              >
                Products
              </Link>
              <Link
                href="/search"
                className={`block ${navLinkClass("/search")}`}
              >
                Search
              </Link>
            </>
          )}

          {user?.role === "Tester" && (
            <Link
              href="/testing"
              className={`block ${navLinkClass("/testing")}`}
            >
              Testing
            </Link>
          )}

          {user?.role === "Manager" && (
            <>
              <Link href="/cpri" className={`block ${navLinkClass("/cpri")}`}>
                CPRI
              </Link>
              <Link
                href="/search"
                className={`block ${navLinkClass("/search")}`}
              >
                Search
              </Link>
            </>
          )}

          <button
            onClick={onLogout}
            className="w-full bg-red-600 py-2 rounded-md hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
