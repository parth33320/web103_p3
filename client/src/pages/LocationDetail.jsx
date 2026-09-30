import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getLocationById, getEventsByLocation } from '../services/api';
import EventCard from '../components/EventCard';
import { MapPin, Calendar, ArrowLeft, Tag, Layers, Filter } from 'lucide-react';

export default function LocationDetail() {
  const { id } = useParams();
  const [location, setLocation] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sorting and Filtering State
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('soonest');

  useEffect(() => {
    setLoading(true);
    Promise.all([getLocationById(id), getEventsByLocation(id)])
      .then(([locationData, eventsData]) => {
        setLocation(locationData);
        setEvents(eventsData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load location details and associated events.');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="loading-state">Loading location details...</div>;
  }

  if (error || !location) {
    return (
      <div className="error-state">
        <p>{error || 'Location not found.'}</p>
        <Link to="/" className="btn-secondary">
          <ArrowLeft size={16} /> Back to Locations
        </Link>
      </div>
    );
  }

  // Categories list
  const categories = ['All', ...new Set(events.map((e) => e.category))];

  // Filter & Sort Logic
  const filteredEvents = events.filter((e) => {
    if (categoryFilter === 'All') return true;
    return e.category === categoryFilter;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const timeA = new Date(a.date_time).getTime();
    const timeB = new Date(b.date_time).getTime();
    return sortOrder === 'soonest' ? timeA - timeB : timeB - timeA;
  });

  return (
    <div className="page-container">
      <Link to="/" className="back-link">
        <ArrowLeft size={18} /> Back to All Locations
      </Link>

      <div className="location-detail-header">
        <div className="location-banner-image-wrapper">
          <img src={location.image} alt={location.name} className="location-banner-image" />
          <span className="location-banner-category">{location.category}</span>
        </div>
        <div className="location-detail-info">
          <h1 className="location-detail-title">{location.name}</h1>
          <p className="location-detail-address">
            <MapPin size={20} /> {location.address}
          </p>
          <p className="location-detail-description">{location.description}</p>
        </div>
      </div>

      <section className="events-section">
        <div className="events-section-bar">
          <div className="section-title">
            <h2>
              <Calendar className="section-icon" /> Associated Events ({events.length})
            </h2>
          </div>

          <div className="filter-controls">
            <div className="filter-group">
              <label htmlFor="category-select">
                <Filter size={16} /> Category:
              </label>
              <select
                id="category-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="sort-select">
                <Layers size={16} /> Order:
              </label>
              <select
                id="sort-select"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="soonest">Date: Soonest First</option>
                <option value="latest">Date: Latest First</option>
              </select>
            </div>
          </div>
        </div>

        {sortedEvents.length === 0 ? (
          <div className="empty-state">No events match the selected criteria for this location.</div>
        ) : (
          <div className="events-list">
            {sortedEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
