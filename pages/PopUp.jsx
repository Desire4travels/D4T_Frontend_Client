'use client';

import React, { useState, useEffect } from 'react';
import styles from './PopUp.module.css';
import Image from 'next/image';
import Popup from '../public/assets/Popup.png';
import axios from 'axios';

export default function PopUp() {
  const [isVisible, setIsVisible] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [destination, setDestination] = useState('');

  useEffect(() => {
    const dismissed = sessionStorage.getItem('travelPopupDismissed');
    if (!dismissed) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('travelPopupDismissed', 'true');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = { mobileNumber, destination };

    try {
      await axios.post('https://desire4travels-1.onrender.com/api/popup-enquiries', formData);
      alert('Submitted successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Submission failed!');
    }

    handleClose();
  };

  if (!isVisible) return null;

  return (
    <div className={styles['popup-overlay']}>
      <div className={styles['popup-card']}>
        <button className={styles['popup-close-button']} onClick={handleClose}>×</button>
        <form className={styles['popup-form']} onSubmit={handleSubmit}>
          <h2>Plan Your Next Journey</h2>
          <input
            type="tel"
            placeholder="Mobile Number"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Where do you want to go?"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
          />
          <button type="submit">Talk with Our Travel Experts</button>
        </form>
        <div className={styles['popup-image']}>
          <Image src={Popup} alt="Travel" width={400} height={400} />
        </div>
      </div>
    </div>
  );
}
