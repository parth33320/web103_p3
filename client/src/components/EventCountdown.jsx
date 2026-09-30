import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2 } from 'lucide-react';

export default function EventCountdown({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

  function calculateTimeLeft(dateStr) {
    const difference = new Date(dateStr) - new Date();
    if (difference <= 0) {
      return { isPast: true };
    }

    return {
      isPast: false,
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.isPast) {
    return (
      <div className="countdown-badge past">
        <CheckCircle2 size={16} />
        <span>Event Passed</span>
      </div>
    );
  }

  return (
    <div className="countdown-badge active">
      <Clock size={16} />
      <div className="countdown-timer">
        <span>{timeLeft.days}d</span>
        <span>{String(timeLeft.hours).padStart(2, '0')}h</span>
        <span>{String(timeLeft.minutes).padStart(2, '0')}m</span>
        <span>{String(timeLeft.seconds).padStart(2, '0')}s</span>
      </div>
    </div>
  );
}
