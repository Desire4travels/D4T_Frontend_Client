'use client'; // Only needed if using App Router and client-side interactivity

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleTripTypeChange = (type) => {
    if (type) {
      router.push(`/triptype/${type}`);
      setMenuOpen(false);
    }
  };

  const handleLinkClick = () => {
    setMenuOpen(false);
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="nav">
      <div className="nav-header">
        <div className="nav-logo">
          <Link href="/" className="nav-logo" onClick={handleLinkClick}>
            Desire<span>4</span>Travels
          </Link>
        </div>
        <div className="hamburger" onClick={toggleMenu}>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>

      <div className={`nav-container ${menuOpen ? 'open' : ''}`}>
        <ul className="nav-menu">
          <li>
            <Link href="/" className="nav-link" onClick={handleLinkClick}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/destination" className="nav-link" onClick={handleLinkClick}>
              Destinations
            </Link>
          </li>
          <li className="dropdown">
            <div className="dropdown-container">
              <button className="dropdown-toggle">TRIP TYPE</button>
              <ul className="dropdown-menu">
                {["mountain", "beach", "religious", "treks", "offbeat", "other"].map((type) => (
                  <li key={type}>
                    <button onClick={() => handleTripTypeChange(type)}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </li>
          <li>
            <Link href="/package" className="nav-link" onClick={handleLinkClick}>
              Packages
            </Link>
          </li>
          <li>
            <Link href="/contact" className="nav-link" onClick={handleLinkClick}>
              Contact Us
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
