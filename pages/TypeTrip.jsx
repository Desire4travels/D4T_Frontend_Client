import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from './TypeTrip.module.css';
import Mountain from '../public/assets/Mountain.webp';
import Beach from '../public/assets/Beach.webp';
import Religious from '../public/assets/Religious.webp';
import Treks from '../public/assets/Treks.webp';
import Offbeat from '../public/assets/Offbeat.webp';
import Other from '../public/assets/Other.webp';

const types = [
  { name: 'Mountain', image: Mountain },
  { name: 'Beach', image: Beach },
  { name: 'Religious', image: Religious },
  { name: 'Treks', image: Treks },
  { name: 'Offbeat', image: Offbeat },
  { name: 'Other', image: Other }
];

const TypeTrip = () => {
  return (
    <div className={styles.typetrip}>
      <Head>
        <title>Trip Types | Your Company Name</title>
        <meta name="description" content="Explore various types of trips like mountain, beach, religious, and more to plan your next adventure." />
        <meta name="keywords" content="trip types, mountain, beach, religious, treks, offbeat, other travel" />
        <meta name="author" content="Your Company Name" />
        <meta property="og:title" content="Explore Different Types of Trips" />
        <meta property="og:description" content="Browse through a wide range of trip types to find your perfect getaway." />
      </Head>
      <h1>Type of Trips</h1>
      <div className={styles.typetripBox}>
        {types.map((type) => (
          <Link key={type.name} href={`/triptype/${type.name.toLowerCase()}`} legacyBehavior>
            <a className={styles.typetripcard}>
              <img src={type.image.src} alt={type.name} className={styles.logo} />
              <p>{type.name}</p>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TypeTrip;
