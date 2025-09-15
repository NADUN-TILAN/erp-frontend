import React from "react";
import Link from "next/link";

const navLinks = [
  { href: "/", label: "Dashboard" },
  { href: "/inventory", label: "Inventory" },
  { href: "/sales", label: "Sales" },
  { href: "/orders", label: "Orders" },
  { href: "/reports", label: "Reports" },
  { href: "/users", label: "Users" }, // Added Users nav link
];

function NavBar() {
  return (
    <nav className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-indigo-600 text-white grid place-items-center font-bold">E</div>
          <h2 className="text-lg font-semibold text-gray-900">ERP System</h2>
        </div>
        <ul className="flex items-center gap-4 text-sm">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="rounded-md px-3 py-1.5 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;