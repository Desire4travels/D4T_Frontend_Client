import React from 'react';
import { useRouter } from 'next/router';
import DestinationCard from '../../components/DestinationCard.jsx';
import Head from 'next/head';

// Server-side rendering (SSR) function
export async function getServerSideProps(context) {
  const { type } = context.params;

  try {
    const res = await fetch('https://desire4travels-1.onrender.com/api/destinations');

    if (!res.ok) {
      throw new Error('Failed to fetch destinations');
    }

    const data = await res.json();

    const normalizedType = type.toLowerCase();
    const filteredDestinations = data.destinations.filter(dest => {
      if (Array.isArray(dest.type)) {
        return dest.type.some(t => t.toLowerCase() === normalizedType);
      }
      return dest.type?.toLowerCase() === normalizedType;
    });

    return {
      props: {
        type,
        destinations: filteredDestinations,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        type,
        destinations: [],
        error: 'Failed to load destinations.',
      },
    };
  }
}

const TripTypePage = ({ type, destinations, error }) => {
  const router = useRouter();
  const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <div className="trip-type-page">
      <Head>
        <title>{capitalizedType} Trips | Explore Destinations</title>
        <meta
          name="description"
          content={`Discover the best ${capitalizedType.toLowerCase()} destinations across India. Find scenic spots, historical sites, and hidden gems ideal for ${capitalizedType.toLowerCase()} lovers.`}
        />
        <meta
          name="keywords"
          content={`${capitalizedType.toLowerCase()} trips, travel, tourism, ${capitalizedType.toLowerCase()} destinations`}
        />
        <meta name="author" content="Your Company Name" />
        <meta property="og:title" content={`Explore ${capitalizedType} Trips`} />
        <meta property="og:description" content={`Top destinations for ${capitalizedType.toLowerCase()} trips. Start planning your adventure now.`} />
      </Head>
     <div className="typecontainer">
      <h1 style={{ fontSize: '2rem', color: 'black', textAlign: 'center', marginBottom: '30px', marginTop: '75px' }}>
        Explore Destinations of {capitalizedType}
      </h1>
     </div>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <div className="cards-container">
        {destinations.length > 0 ? (
          destinations.map(dest => (
            <DestinationCard
              key={dest.id}
              imgSrc={dest.image}
              title={dest.name}
              location={dest.state}
              tripType={dest.type}
              rating={parseFloat(dest.rating || 0).toFixed(1)}
              onClick={() => router.push(`/destination/${dest.id}`)}
            />
          ))
        ) : (
          <p style={{ textAlign: 'center' }}>No destinations found for this type.</p>
        )}
      </div>
    </div>
  );
};

export default TripTypePage;
