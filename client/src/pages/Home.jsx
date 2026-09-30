import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getLocations } from '../services/api';
import { MapPin, ArrowRight, Compass, Sparkles } from 'lucide-react';

export default function Home() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getLocations()
      .then((data) => {
        setLocations(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load locations.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="loading-state">Loading Nexus Community Locations...</div>;
  }

  if (error) {
    return <div className="error-state">{error}</div>;
  }

  return (
    <div className="page-container">
      <section className="hero-banner">
        <div className="hero-badge">
          <Sparkles size={16} /> Virtual Community Space
        </div>
        <h1 className="hero-title">Nexus Innovation & Tech Hub</h1>
        <p className="hero-subtitle">
          Explore interactive spaces, join keynotes, attend workshops, and connect with fellow developers across our virtual community footprint.
        </p>
      </section>

      <section className="locations-section">
        <div className="section-header">
          <h2>
            <Compass className="section-icon" /> Select a Location
          </h2>
          <p>Choose an interactive space below to view upcoming schedules and venue details.</p>
        </div>

        <div className="locations-grid">
          {locations.map((loc) => (
            <Link key={loc.id} to={`/locations/${loc.id}`} className="location-card">
              <div className="location-card-image-wrapper">
                <img src={loc.image} alt={loc.name} className="location-card-image" />
                <span className="location-category-badge">{loc.category}</span>
              </div>
              <div className="location-card-content">
                <h3 className="location-card-title">{loc.name}</h3>
                <p className="location-card-description">{loc.description}</p>
                <div className="location-card-footer">
                  <span className="location-address">
                    <MapPin size={16} /> {loc.address}
                  </span>
                  <span className="explore-button">
                    Explore Space <ArrowRight size={16} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
