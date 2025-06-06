import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import DestinationCard from '../Components/DestinationCard';

const ITEMS_PER_PAGE = 12;
const tripTypes = ['All', 'Mountain', 'Beach', 'Religious', 'Treks', 'Offbeat', 'Other'];

export default function Destination({ initialDestinations, initialFilteredType }) {
  const router = useRouter();
  const { triptype } = router.query;

  const [destinations, setDestinations] = useState(initialDestinations);
  const [filteredType, setFilteredType] = useState(initialFilteredType || 'All');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter destinations on client side when filteredType changes (or reset page)
  const filteredDestinations = React.useMemo(() => {
    if (filteredType === 'All') return destinations;

    const normalizedType = filteredType.toLowerCase();

    return destinations.filter(dest => {
      if (Array.isArray(dest.type)) {
        return dest.type.some(t => t.trim().toLowerCase() === normalizedType);
      }
      return dest.type?.trim().toLowerCase() === normalizedType;
    });
  }, [destinations, filteredType]);

  const totalPages = Math.ceil(filteredDestinations.length / ITEMS_PER_PAGE);
  const paginatedDestinations = filteredDestinations.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Sync filteredType with URL query param on mount or change
  useEffect(() => {
    if (!triptype) {
      setFilteredType('All');
      setCurrentPage(1);
    } else {
      const matchedType =
        tripTypes.find(t => t.toLowerCase() === triptype.toLowerCase()) || 'All';
      setFilteredType(matchedType);
      setCurrentPage(1);
    }
  }, [triptype]);

  const handleTypeChange = (e) => {
    const selected = e.target.value;
    setCurrentPage(1);
    if (selected === 'All') {
      router.push('/destination', undefined, { shallow: true });
    } else {
      router.push(`/destination?triptype=${selected.toLowerCase()}`, undefined, { shallow: true });
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="destination-page">
      <Head>
        <title>Best Places to Visit – Travel Guides & Tips | Desire4Travels</title>
        <meta
          name="description"
          content="Discover stunning travel destinations across continents with Desire4Travels. Browse curated guides, local insights, and inspiration for your next trip."
        />
        <meta
          name="keywords"
          content="travel destinations, top places to visit, destination guides, travel spots, international travel, exotic destinations, Indian destinations, adventure travel locations, tropical vacations, best cities to visit, travel planning, cultural destinations, bucket list places, best places to visit"
        />
        <meta name="author" content="Your Company Name" />
        <meta
          property="og:title"
          content="Best Places to Visit – Travel Guides & Tips | Desire4Travels"
        />
        <meta
          property="og:description"
          content="Discover stunning travel destinations across continents with Desire4Travels. Browse curated guides, local insights, and inspiration for your next trip."
        />
      </Head>

      <header className="destination-hero">
        <div className="destination-hero-content" style={{ position: 'relative' }}>
          <h1 className="destination-title">Destinations</h1>
          <select
            value={filteredType}
            onChange={handleTypeChange}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              padding: '8px 12px',
              fontSize: '1rem',
              borderRadius: '5px',
              border: 'none',
              cursor: 'pointer',
              marginTop: '0.5rem',
            }}
            aria-label="Filter by Trip Type"
          >
            {tripTypes.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </header>

      <div className="cards-container">
        {paginatedDestinations.length > 0 ? (
          paginatedDestinations.map(dest => (
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
          <p>No destinations available.</p>
        )}
      </div>

      {totalPages > 1 && (
        <div style={{ textAlign: 'center', margin: '1rem 0' }}>
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            style={{
              marginRight: '1rem',
              padding: '8px 16px',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            }}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            style={{
              marginLeft: '1rem',
              padding: '8px 16px',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  const { triptype } = context.query || {};

  try {
    const res = await fetch('https://desire4travels-1.onrender.com/api/destinations');
    if (!res.ok) {
      throw new Error('Failed to fetch destinations');
    }
    const data = await res.json();

    const allDestinations = data.destinations || [];

    const normalizeType = (type) => (typeof type === 'string' ? type.trim().toLowerCase() : '');

    let filteredType = 'All';
    let filteredDestinations = allDestinations;

    if (triptype) {
      const normalizedParam = triptype.toLowerCase();
      const validTypes = ['all', 'mountain', 'beach', 'religious', 'treks', 'offbeat', 'other'];

      if (validTypes.includes(normalizedParam)) {
        filteredType = triptype.charAt(0).toUpperCase() + triptype.slice(1).toLowerCase();

        if (normalizedParam !== 'all') {
          filteredDestinations = allDestinations.filter(dest => {
            if (Array.isArray(dest.type)) {
              return dest.type.some(t => normalizeType(t) === normalizedParam);
            }
            return normalizeType(dest.type) === normalizedParam;
          });
        }
      }
    }

    return {
      props: {
        initialDestinations: filteredDestinations,
        initialFilteredType: filteredType,
      },
    };
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return {
      props: {
        initialDestinations: [],
        initialFilteredType: 'All',
      },
    };
  }
}
