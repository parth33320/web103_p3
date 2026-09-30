const { pool } = require('../config/database');

// GET /api/locations
const getLocations = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM locations ORDER BY id ASC;');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ error: 'Failed to retrieve locations' });
  }
};

// GET /api/locations/:id
const getLocationById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM locations WHERE id = $1;', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(`Error fetching location ${id}:`, error);
    res.status(500).json({ error: 'Failed to retrieve location details' });
  }
};

module.exports = {
  getLocations,
  getLocationById
};
