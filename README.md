# Nexus Virtual Community Space — CodePath WEB103 Unit 3 Project

Submitted by: **Jules / Nexus Team**

An interactive Virtual Community Space web application built with Node.js, Express, PostgreSQL, and React. Users can visually explore community locations, view event schedules specific to each location, navigate dedicated event pages, filter/sort events, and monitor real-time event countdowns.

Link to live site: *(Deploy on Render or Railway if applicable)*

---

## Required Features

The following **required** functionality is completed:

- [x] **Backend REST API:** Accessible via an Express API communicating with PostgreSQL.
- [x] **React SPA:** Dynamic frontend rendering using React and React Router.
- [x] **PostgreSQL Database:** Database hosting supporting locations and events tables with proper foreign key relationships.
- [x] **Front Page & Styling:** Styled landing page with clear branding ("Nexus Innovation & Tech Hub").
- [x] **Visual Location Selection:** Visual cards with images and metadata for location selection (non-text link requirement satisfied).
- [x] **Location Detail Page:** Unique URL path for each location (`/locations/:id`).
- [x] **Location Events List:** Navigating to a location detail page displays its specific associated events.

---

## Stretch Features

The following **stretch** functionality is completed:

- [x] **Additional Events Page:** Dedicated `/events` page displaying all possible events across all locations.
- [x] **Sorting & Filtering:** Multi-select filtering by Location and Category, plus date sorting (Soonest First / Latest First).
- [x] **Live Countdowns:** Active real-time countdown timer ticking down days, hours, minutes, and seconds.
- [x] **Past Event Styling:** Distinct formatting for past events (greyed out state, "Event Passed" badge, and strikethrough title).

---

## Video Walkthrough & Demo

Here is a preview of the implemented features:

![Demo Walkthrough](./assets/demo.gif)

---

## Installation & Setup Instructions

### Prerequisites
- Node.js v18+
- npm v9+

### Step-by-step Setup
1. **Clone repository:**
   ```bash
   git clone <repository-url>
   cd app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   cd client && npm install && cd ..
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   DATABASE_URL=postgres://user:password@host:5432/dbname
   ```

4. **Database Reset / Seeding (Local or Mock):**
   To seed local/mock database tables:
   ```bash
   USE_MOCK_DB=true node server/config/reset.js
   ```

5. **Build & Run:**
   ```bash
   # Build React client
   cd client && npm run build && cd ..

   # Start production server
   USE_MOCK_DB=true npm start
   ```

   Visit `http://localhost:3000` in your browser.
