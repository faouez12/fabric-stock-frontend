import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles.css"; // correct import for your current structure

export default function Navbar() {
  const location = useLocation();

  const links = [
    { to: "/articles", label: "Articles" }, // Moved to top ✅
    { to: "/stockage", label: "Stockage" },
    { to: "/destockage", label: "Déstockage" },
    { to: "/emplacement", label: "Emplacement" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/bon-de-sortie", label: "Bon de Sortie" },
  ];

  return (
    <nav className="navbar">
      {links.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className={`nav-link ${
            location.pathname === link.to ? "active" : ""
          }`}
          style={{
            textDecoration: "none",
            color: location.pathname === link.to ? "#007bff" : "#333",
            fontWeight: location.pathname === link.to ? "600" : "500",
            paddingBottom: "4px",
            borderBottom:
              location.pathname === link.to ? "2px solid #007bff" : "none",
            transition: "color 0.2s, border-bottom 0.2s",
          }}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
