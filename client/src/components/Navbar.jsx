import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Building2, Calendar, Sparkles } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <Sparkles className="icon-sparkle" />
          <span>Nexus Community Hub</span>
        </Link>
        <nav className="navbar-links">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            <Building2 size={18} />
            <span>Locations</span>
          </NavLink>
          <NavLink to="/events" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            <Calendar size={18} />
            <span>All Events</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
