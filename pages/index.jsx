import { useEffect, useRef, useState } from 'react';
import Hero from '../components/Hero';
import TopDestination from './TopDestination';
import TypeTrip from './TypeTrip';
import Review from './reviews';
import PlanTrip from './PlanTrip';

export default function Home({ heroData }) {
  const [heroCount, setHeroCount] = useState(0);
  const planTripRef = useRef(null);

  useEffect(() => {
    if (!heroData || heroData.length === 0) return;

    const interval = setInterval(() => {
      setHeroCount((count) => (count === heroData.length - 1 ? 0 : count + 1));
    }, 10000);

    return () => clearInterval(interval);
  }, [heroData]);

  return (
    <>
      {heroData && heroData.length > 0 && (
        <Hero
          heroData={heroData[heroCount]}
          heroCount={heroCount}
          setHeroCount={setHeroCount}
          planTripRef={planTripRef}
        />
      )}
      <TopDestination />
      <TypeTrip />
      <Review />
      <div ref={planTripRef}>
        <PlanTrip />
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const heroData = [
    {
      text1: "Manali, Himachal Pradesh",
      text2:
        "Manali offers snow, adventure, scenic beauty, skiing, trekking, paragliding, mountain views, local cuisine, and serene valleys and beautiful landscapes.",
    },
    {
      text1: "Munnar, Kerala",
      text2:
        "Munnar, a picturesque hill station in Kerala, offers tea plantations, misty mountains, wildlife, and serene landscapes for a peaceful escape.",
    },
    {
      text1: "Rishikesh, Uttarakhand",
      text2:
        "Rishikesh, the Yoga Capital of the World, offers serene ashrams, yoga retreats, and adventure sports like rafting, set along the Ganges River.",
    },
  ];

  return {
    props: {
      heroData,
    },
  };
}
