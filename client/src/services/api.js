const API_BASE_URL = '/api';

export const getLocations = async () => {
  const response = await fetch(`${API_BASE_URL}/locations`);
  if (!response.ok) {
    throw new Error('Failed to fetch locations');
  }
  return await response.json();
};

export const getLocationById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/locations/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch location with id ${id}`);
  }
  return await response.json();
};

export const getAllEvents = async () => {
  const response = await fetch(`${API_BASE_URL}/events`);
  if (!response.ok) {
    throw new Error('Failed to fetch events');
  }
  return await response.json();
};

export const getEventsByLocation = async (locationId) => {
  const response = await fetch(`${API_BASE_URL}/events/location/${locationId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch events for location ${locationId}`);
  }
  return await response.json();
};
