# Nexus Virtual Community Space — System Architecture & Execution Call Stacks

## 1. Executive Summary & Overview
The **Nexus Virtual Community Space** is a full-stack web application developed for CodePath WEB103 Unit 3. It allows users to interactively browse community spaces (locations), view event schedules associated with specific venues, filter/sort events globally, and track event timing via live countdown timers and past event indicators.

- **Frontend:** Single-page application built with React, React Router, Lucide React icons, Vite, and custom CSS design system.
- **Backend:** Node.js, Express REST API, CORS middleware, static file delivery.
- **Database:** PostgreSQL (hosted on Render in production via `pg` pool with SSL enabled, with `pg-mem` fallback for local CI/testing).

---

## 2. Project, Folder & File Architecture

```
/
├── server/                         # Backend Express Application
│   ├── config/
│   │   ├── database.js            # PostgreSQL pg.Pool configuration & pg-mem test fallback
│   │   └── reset.js               # SQL database table creation and seed data script
│   ├── controllers/
│   │   ├── locationsController.js # API Controller for location endpoints
│   │   └── eventsController.js    # API Controller for event endpoints
│   ├── routes/
│   │   ├── locations.js           # Express Router mapping /api/locations routes
│   │   └── events.js              # Express Router mapping /api/events routes
│   └── server.js                  # Main Express application entry point & static server
│
├── client/                         # Frontend React Application
│   ├── public/                    # Static assets & HTML template
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx         # Sticky header with navigation links
│   │   │   ├── EventCard.jsx      # Reusable event card with date, image, past styling
│   │   │   └── EventCountdown.jsx # Real-time ticking countdown timer component
│   │   ├── pages/
│   │   │   ├── Home.jsx           # Landing page listing location cards
│   │   │   ├── LocationDetail.jsx # Detail view for a location and its events
│   │   │   └── AllEvents.jsx      # Dedicated page listing all events with filters/sorting
│   │   ├── services/
│   │   │   └── api.js             # Modular fetch client servicing API endpoints
│   │   ├── App.jsx                # Client application root with React Router configuration
│   │   ├── App.css                # Custom CSS design system
│   │   └── main.jsx               # React DOM entry point
│   └── vite.config.js             # Vite dev server proxy & build setup
│
├── docs/
│   └── ARCHITECTURE.md            # Comprehensive architectural documentation & call stacks
├── assets/
│   └── demo.gif                   # E2E demo walkthrough GIF
├── package.json                   # Root workspace scripts & backend dependencies
└── .env                           # Database & port configuration environment variables
```

---

## 3. Detailed File Directory & Module Responsibilities

### Configuration Files
- **`server/config/database.js`**: Configures PostgreSQL connection pooling (`pg.Pool`) using `DATABASE_URL` or individual `PGUSER`, `PGPASSWORD`, `PGHOST`, `PGPORT`, `PGDATABASE` environment variables with SSL enabled. Automatically detects test/mock environments and instantiates `pg-mem`.
- **`server/config/reset.js`**: Schema creation (`locations` and `events` tables) and database resets. Populates initial locations and events data.
- **`.env`**: Stores sensitive database credentials and server settings.

### Server Modules
- **`server/server.js`**: Initializes Express, CORS, JSON parsing, API routes (`/api/locations`, `/api/events`), healthcheck (`/api/health`), and static file serving for React build artifacts (`client/dist`).
- **`server/controllers/locationsController.js`**: Handles `getLocations` (SELECT all) and `getLocationById` (SELECT single).
- **`server/controllers/eventsController.js`**: Handles `getAllEvents`, `getEventsByLocation`, and `getEventById`.

### Client Services & Components
- **`client/src/services/api.js`**: Encapsulates fetch requests to `/api/locations` and `/api/events`.
- **`client/src/components/EventCountdown.jsx`**: Runs a 1-second `setInterval` loop to compute time difference until `targetDate`, displaying days, hours, minutes, seconds, or "Event Passed".
- **`client/src/components/EventCard.jsx`**: Formats event metadata, applies conditional strikethrough/overlay styles for past events, and mounts `EventCountdown`.
- **`client/src/pages/Home.jsx`**: Queries locations on mount (`useEffect`) and renders interactive location cards.
- **`client/src/pages/LocationDetail.jsx`**: Fetches location metadata and associated events by location ID; includes category filter and date order toggles.
- **`client/src/pages/AllEvents.jsx`**: Fetches all events and locations; provides multi-select filtering (location, category) and date sorting (soonest/latest).

---

## 4. Full Call Stack & Granular 6-Tier Execution Traces

### Trace 1: Location Selection & Navigation Flow (User Clicks Location Card)

Execution Call Stack Trace:
└── [Project] Client SPA Runtime (http://localhost:3000)
    ├── [Configuration/Env] API_BASE_URL="/api", PORT=3000
    └── [Folder] client/src/pages
        └── [File] Home.jsx
            └── [Class] React Function Component <Home>
                └── [Method] handleLocationClick(locationId = 1)
                    ├── [Variable State Shift] Inbound Click Event: target.id = 1
                    ├── [Variable State Shift] Route Transition: navigate("/locations/1")
                    └── [Method] React Router Location Shift
                        └── [Folder] client/src/pages
                            └── [File] LocationDetail.jsx
                                └── [Class] React Function Component <LocationDetail>
                                    └── [Method] useEffect()
                                        ├── [Variable State Shift] Param Extraction: id = "1"
                                        ├── [Variable State Shift] Loading State Set: loading = true
                                        └── [Method] getLocationById(id = 1) / getEventsByLocation(locationId = 1)
                                            └── [Folder] client/src/services
                                                └── [File] api.js
                                                    └── [Method] fetch("/api/events/location/1")
                                                        └── [Project] Network Boundary (HTTP GET /api/events/location/1)
                                                            └── [Folder] server/routes
                                                                └── [File] events.js
                                                                    └── [Method] router.get("/location/:location_id")
                                                                        └── [Folder] server/controllers
                                                                            └── [File] eventsController.js
                                                                                └── [Method] getEventsByLocation(req, res)
                                                                                    ├── [Variable State Shift] Inbound Req Param: req.params.location_id = "1"
                                                                                    ├── [Variable State Shift] SQL Query Executed: "SELECT e.*, l.name ... WHERE e.location_id = $1"
                                                                                    └── [Method] pool.query(queryText, [1])
                                                                                        └── [Project] Database Engine (PostgreSQL / Render Pool)
                                                                                            ├── [Variable State Shift] Query Execution: Filtered events array returned (len = 2)
                                                                                            └── [Variable State Shift] HTTP Response: res.status(200).json(eventsRows)
                                                                                    └── [Method] Client Promise Resolution (.then(eventsData))
                                                                                        ├── [Variable State Shift] React State Set: setEvents(eventsData)
                                                                                        ├── [Variable State Shift] React State Set: setLoading(false)
                                                                                        └── [Method] DOM Re-render <LocationDetail>
                                                                                            └── [Class] <EventCard event={eventObj}>
                                                                                                └── [Method] <EventCountdown targetDate={event.date_time}>
                                                                                                    ├── [Variable State Shift] Computed Difference: 201600000ms (+2 days)
                                                                                                    └── [Variable State Shift] DOM Display: "2d 04h 00m 00s"

---

### Trace 2: Global Event Filtering & Sorting Execution (All Events Page)

Execution Call Stack Trace:
└── [Project] Client SPA Runtime (http://localhost:3000/events)
    ├── [Configuration/Env] REACT_APP_API_URL="/api"
    └── [Folder] client/src/pages
        └── [File] AllEvents.jsx
            └── [Class] React Function Component <AllEvents>
                └── [Method] handleCategorySelect(event.target.value = "Conference")
                    ├── [Variable State Shift] React State Mutation: selectedCategory = "Conference"
                    ├── [Variable State Shift] Filter Re-evaluation: events.filter(e => e.category === "Conference")
                    ├── [Variable State Shift] Filter Outcome: filteredEvents.length (reduced from 7 to 2)
                    └── [Method] handleSortChange(event.target.value = "latest")
                        ├── [Variable State Shift] React State Mutation: sortOrder = "latest"
                        ├── [Variable State Shift] Sort Comparator Executed: (timeB - timeA)
                        ├── [Variable State Shift] Array Re-ordering: sortedEvents[0].date_time = "2026-03-20T..."
                        └── [Method] DOM Mutation & Component Re-render
                            └── [Folder] client/src/components
                                └── [File] EventCard.jsx
                                    └── [Class] React Component <EventCard>
                                        ├── [Variable State Shift] Props Pass: event.title = "Global AI & LLM Summit 2026"
                                        ├── [Variable State Shift] Date Calculation: isPast = false
                                        └── [Method] Render Active Countdown Badge
