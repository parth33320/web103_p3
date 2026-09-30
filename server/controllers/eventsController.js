const { pool } = require('../config/database');

// GET /api/events
const getAllEvents = async (req, res) => {
  try {
    const queryText = `
      SELECT e.*, l.name as location_name, l.address as location_address
      FROM events e
      JOIN locations l ON e.location_id = l.id
      ORDER BY e.date_time ASC;
    `;
    const result = await pool.query(queryText);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching all events:', error);
    res.status(500).json({ error: 'Failed to retrieve events' });
  }
};

// GET /api/events/location/:location_id
const getEventsByLocation = async (req, res) => {
  const { location_id } = req.params;
  try {
    const queryText = `
      SELECT e.*, l.name as location_name, l.address as location_address
      FROM events e
      JOIN locations l ON e.location_id = l.id
      WHERE e.location_id = $1
      ORDER BY e.date_time ASC;
    `;
    const result = await pool.query(queryText, [location_id]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(`Error fetching events for location ${location_id}:`, error);
    res.status(500).json({ error: 'Failed to retrieve events for location' });
  }
};

// GET /api/events/:id
const getEventById = async (req, res) => {
  const { id } = req.params;
  try {
    const queryText = `
      SELECT e.*, l.name as location_name, l.address as location_address
      FROM events e
      JOIN locations l ON e.location_id = l.id
      WHERE e.id = $1;
    `;
    const result = await pool.query(queryText, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(`Error fetching event ${id}:`, error);
    res.status(500).json({ error: 'Failed to retrieve event details' });
  }
};

module.exports = {
  getAllEvents,
  getEventsByLocation,
  getEventById
};
