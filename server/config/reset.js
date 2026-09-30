const { pool } = require('./database');

const createTablesSQL = `
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS locations CASCADE;

CREATE TABLE locations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image VARCHAR(512) NOT NULL,
  address VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL
);

CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  location_id INT REFERENCES locations(id) ON DELETE CASCADE,
  date_time TIMESTAMP NOT NULL,
  category VARCHAR(100) NOT NULL,
  image_url VARCHAR(512) NOT NULL
);
`;

const locationsData = [
  {
    name: 'Main Stage Auditorium',
    description: 'The primary venue for keynote speeches, live tech demos, and large community assemblies.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
    address: '101 Innovation Way, Floor 1',
    category: 'Keynotes & Presentations'
  },
  {
    name: 'Developer Lounge',
    description: 'Collaborative open space equipped with high-speed fiber internet, whiteboards, and ergonomic workstations.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    address: '101 Innovation Way, Suite 202',
    category: 'Networking & Coworking'
  },
  {
    name: 'Hardware & AI Lab',
    description: 'High-tech prototyping lab equipped with 3D printers, IoT hardware kits, and GPU compute nodes.',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
    address: '101 Innovation Way, Suite 305',
    category: 'Workshops & Labs'
  },
  {
    name: 'Outdoor Community Plaza',
    description: 'Spacious outdoor courtyard for casual networking, food trucks, outdoor hackathons, and evening mixers.',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    address: '101 Innovation Way, Courtyard',
    category: 'Social & Outdoor'
  }
];

const getFuturePastDates = () => {
  const now = new Date();

  const future1 = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000); // +2d 4h
  const future2 = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000); // +5d 12h
  const future3 = new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000); // +8d 2h
  const future4 = new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000); // +12d 6h
  const future5 = new Date(now.getTime() + 18 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000); // +18d 1h

  const past1 = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000); // -3d
  const past2 = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000); // -10d

  return { future1, future2, future3, future4, future5, past1, past2 };
};

let resetPromise = null;

const resetDatabase = async () => {
  if (resetPromise) return resetPromise;

  resetPromise = (async () => {
    try {
      console.log('[Reset] Recreating database tables...');
      await pool.query(createTablesSQL);

      console.log('[Reset] Inserting location records...');
      const insertedLocations = [];
      for (const loc of locationsData) {
        const res = await pool.query(
          `INSERT INTO locations (name, description, image, address, category)
           VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
          [loc.name, loc.description, loc.image, loc.address, loc.category]
        );
        insertedLocations.push(res.rows[0]);
      }

      const dates = getFuturePastDates();

      const eventsData = [
        {
          title: 'Global AI & LLM Summit 2026',
          description: 'Explore state-of-the-art developments in generative AI, multi-agent frameworks, and local LLM fine-tuning.',
          location_id: insertedLocations[0].id, // Main Stage
          date_time: dates.future1,
          category: 'Conference',
          image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80'
        },
        {
          title: 'Past Keynote: Web3 & Decentralized Systems',
          description: 'Retrospective overview of peer-to-peer networking, zero-knowledge proofs, and smart contract security.',
          location_id: insertedLocations[0].id, // Main Stage
          date_time: dates.past1,
          category: 'Conference',
          image_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80'
        },
        {
          title: 'Full-Stack JavaScript Hackathon Showcase',
          description: 'Live 5-minute project demos built by local community engineers using React, Node.js, and PostgreSQL.',
          location_id: insertedLocations[1].id, // Developer Lounge
          date_time: dates.future2,
          category: 'Hackathon',
          image_url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80'
        },
        {
          title: 'Past Workshop: Docker & Kubernetes Deep Dive',
          description: 'Hands-on containerization lab mastering Docker compose and multi-stage container deployments.',
          location_id: insertedLocations[1].id, // Developer Lounge
          date_time: dates.past2,
          category: 'Workshop',
          image_url: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=800&q=80'
        },
        {
          title: 'Embedded Robotics & Microcontroller Workshop',
          description: 'Hands-on hardware lab soldering custom PCBs and programming ESP32 microcontrollers with Rust & C++.',
          location_id: insertedLocations[2].id, // Hardware Lab
          date_time: dates.future3,
          category: 'Workshop',
          image_url: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=800&q=80'
        },
        {
          title: '3D Printing & Rapid Prototyping Masterclass',
          description: 'Learn CAD modeling, SLA/FDM slicing, and rapid prototyping workflows for physical hardware products.',
          location_id: insertedLocations[2].id, // Hardware Lab
          date_time: dates.future4,
          category: 'Workshop',
          image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
        },
        {
          title: 'Community Tech Mixer & Food Truck Evening',
          description: 'Casual outdoor evening meetup featuring local craft beverages, food trucks, and open networking.',
          location_id: insertedLocations[3].id, // Outdoor Plaza
          date_time: dates.future5,
          category: 'Social',
          image_url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80'
        }
      ];

      console.log('[Reset] Inserting event records...');
      for (const evt of eventsData) {
        await pool.query(
          `INSERT INTO events (title, description, location_id, date_time, category, image_url)
           VALUES ($1, $2, $3, $4, $5, $6);`,
          [evt.title, evt.description, evt.location_id, evt.date_time, evt.category, evt.image_url]
        );
      }

      console.log('[Reset] Database reset and seeding completed successfully!');
    } catch (error) {
      console.error('[Reset] Error seeding database:', error);
      throw error;
    }
  })();

  return resetPromise;
};

if (require.main === module) {
  resetDatabase().then(() => process.exit(0)).catch(() => process.exit(1));
}

module.exports = { resetDatabase };
