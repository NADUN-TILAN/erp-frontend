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
    <nav className="navbar">
      <div className="navbar-logo">
        <h2>ERP System</h2>
      </div>
      <ul className="navbar-links">
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default NavBar;