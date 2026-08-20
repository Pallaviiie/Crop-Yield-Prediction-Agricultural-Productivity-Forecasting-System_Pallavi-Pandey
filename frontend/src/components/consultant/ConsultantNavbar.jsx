import React from "react";
import { Bell, Menu, Search } from "lucide-react";

export default function ConsultantNavbar({ title, onToggle }) {
  const userName = localStorage.getItem("user_name") || "Shivam Dagar";
  const role = localStorage.getItem("user_role") || "Consultant";
  const initial = userName.charAt(0).toUpperCase();

  return (
    <header className="ys-navbar">
      <div className="ys-navbar-left">
        <button className="ys-menu-button" onClick={onToggle} aria-label="Toggle sidebar">
          <Menu size={21} strokeWidth={2} />
        </button>
        <h1>{title}</h1>
      </div>

      <div className="ys-navbar-right">
        <div className="ys-search">
          <Search size={17} />
          <input placeholder="Search..." />
        </div>

        <button className="ys-icon-button" aria-label="Notifications">
          <Bell size={20} />
          <span className="ys-notification-dot" />
        </button>

        <div className="ys-navbar-user">
          <div className="ys-avatar">{initial}</div>
          <div>
            <strong>{userName}</strong>
            <span>{role}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
