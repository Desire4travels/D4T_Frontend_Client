import React from "react";
import PackageCard from "../components/PackageCard";
import Head from "next/head";
import styles from "../styles/Package.module.css";

export default function Package({ packages }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Travel Deals for Couples, Families & Groups | Desire4Travels</title>
        <meta
          name="description"
          content="Browse our travel packages for every style and budget. From romantic getaways to adventure tours, Desire4Travels offers custom itineraries and great deals."
        />
        <meta
          name="keywords"
          content="travel packages, vacation packages, custom travel plans, adventure travel deals, romantic getaways, family vacation packages, Couple packages, Honeymoon packages, budget travel packages, luxury travel deals, group travel packages, holiday deals, tour packages, personalized travel packages, travel itineraries, Desire4Travels packages"
        />
        <meta name="author" content="Your Company Name" />
        <meta property="og:title" content="Travel Deals for Couples, Families & Groups | Desire4Travels" />
        <meta
          property="og:description"
          content="Browse our travel packages for every style and budget. From romantic getaways to adventure tours, Desire4Travels offers custom itineraries and great deals."
        />
        <meta property="og:type" content="website" />
      </Head>

      <div>
        <header className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.title}>Our Packages</h1>
          </div>
        </header>

        <div className={styles.grid}>
          {packages.length > 0 ? (
            packages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                id={pkg.id}
                imgSrc={pkg.photo}
                packageName={pkg.packageName}
                destinations={pkg.destinations}
                price={pkg.price}
                duration={pkg.duration}
              />
            ))
          ) : (
            <p>No packages available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const res = await fetch("https://desire4travels-1.onrender.com/api/packages");
    if (!res.ok) {
      throw new Error("Failed to fetch packages");
    }
    const packages = await res.json();

    return {
      props: { packages }, 
    };
  } catch (error) {
    console.error("Error fetching packages:", error);

    return {
      props: { packages: [] },
    };
  }
}
