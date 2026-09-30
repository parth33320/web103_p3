import React, { useEffect, useState } from 'react';
import { getAllEvents, getLocations } from '../services/api';
import EventCard from '../components/EventCard';
import { Calendar, Filter, MapPin, Layers } from 'lucide-react';

export default function AllEvents() {
  const [events, setEvents] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Sorting state
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('soonest');

  useEffect(() => {
    Promise.all([getAllEvents(), getLocations()])
      .then(([eventsData, locationsData]) => {
        setEvents(eventsData);
        setLocations(locationsData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to fetch events list.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="loading-state">Loading all community events...</div>;
  }

  if (error) {
    return <div className="error-state">{error}</div>;
  }

  const categories = ['All', ...new Set(events.map((e) => e.category))];

  // Filtering
  const filteredEvents = events.filter((e) => {
    const matchesLocation =
      selectedLocation === 'All' || e.location_id === parseInt(selectedLocation);
    const matchesCategory =
      selectedCategory === 'All' || e.category === selectedCategory;
    return matchesLocation && matchesCategory;
  });

  // Sorting
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const timeA = new Date(a.date_time).getTime();
    const timeB = new Date(b.date_time).getTime();
    return sortOrder === 'soonest' ? timeA - timeB : timeB - timeA;
  });

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>
          <Calendar className="header-icon" /> All Community Events
        </h1>
        <p>Explore all keynotes, hackathons, workshops, and mixers taking place across Nexus locations.</p>
      </header>

      <section className="filters-banner">
        <div className="filter-item">
          <label htmlFor="location-filter">
            <MapPin size={16} /> Location:
          </label>
          <select
            id="location-filter"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="All">All Locations</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <label htmlFor="category-filter">
            <Filter size={16} /> Category:
          </label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <label htmlFor="sort-order">
            <Layers size={16} /> Sort By Date:
          </label>
          <select
            id="sort-order"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="soonest">Soonest First</option>
            <option value="latest">Latest First</option>
          </select>
        </div>
      </section>

      {sortedEvents.length === 0 ? (
        <div className="empty-state">No events match your selected filters.</div>
      ) : (
        <div className="events-list">
          {sortedEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
