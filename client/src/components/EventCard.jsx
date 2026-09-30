import React from 'react';
import { Calendar, MapPin, Tag } from 'lucide-react';
import EventCountdown from './EventCountdown';

export default function EventCard({ event }) {
  const isPast = new Date(event.date_time) < new Date();
  const formattedDate = new Date(event.date_time).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  return (
    <div className={`event-card ${isPast ? 'event-past' : ''}`}>
      <div className="event-image-container">
        <img src={event.image_url} alt={event.title} className="event-image" />
        <span className="event-category-pill">{event.category}</span>
        {isPast && <div className="past-overlay-badge">Passed</div>}
      </div>

      <div className="event-content">
        <div className="event-header">
          <h3 className={`event-title ${isPast ? 'strikethrough' : ''}`}>
            {event.title}
          </h3>
          <EventCountdown targetDate={event.date_time} />
        </div>

        <p className="event-description">{event.description}</p>

        <div className="event-meta">
          <div className="meta-item">
            <Calendar size={16} />
            <span>{formattedDate}</span>
          </div>
          {event.location_name && (
            <div className="meta-item">
              <MapPin size={16} />
              <span>{event.location_name} ({event.location_address})</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
