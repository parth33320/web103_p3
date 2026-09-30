import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import LocationDetail from './pages/LocationDetail';
import AllEvents from './pages/AllEvents';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/locations/:id" element={<LocationDetail />} />
          <Route path="/events" element={<AllEvents />} />
        </Routes>
      </main>
      <footer className="footer">
        <p>© 2026 Nexus Virtual Community Hub • CodePath WEB103 Project 3</p>
      </footer>
    </BrowserRouter>
  );
}
