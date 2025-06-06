import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Navbar from "../Components/Navbar.jsx";
import Footer from "../Components/Footer.jsx";
import Popup from "./PopUp.jsx";
import ScrollToTop from "../Components/ScrollToTop.jsx";
import Tawk from "../Components/Tawk.jsx";

import '../styles/globals.css';  
import '../styles/App.css';      
import '../styles/Contact.css';
import '../styles/Destination.css';
import '../styles/Navbar.css';
import '../styles/Footer.css';
import '../styles/PackageCard.css';
import '../styles/DestinationCard.css';
import '../styles/Hero.css';
import '../styles/Aboutus.css';
import '../styles/CareerPage.css';
import '../styles/Review.css';
import '../styles/Faq.css';
import '../styles/TermsandConditions.css';
import '../styles/BlogList.css';
import '../styles/BlogPost.css';
import '../styles/TripTypePage.css';
import '../styles/DestinationDetails.css';
import '../styles/PackageDetails.css';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [isPopupVisible, setIsPopupVisible] = useState(true);
  const excludedPaths = ["/login", "/signup"];

  useEffect(() => {
    setIsPopupVisible(true);
  }, [router.pathname]);

  const blurClass = isPopupVisible ? "blurred" : "";

  return (
    <div className="app-container">
      <ScrollToTop />
      {!excludedPaths.includes(router.pathname) && isPopupVisible && (
        <Popup onClose={() => setIsPopupVisible(false)} />
      )}
      <Navbar />
      <div className={`app-content ${blurClass}`}>
        <Component {...pageProps} />
      </div>
      <Tawk />
      <Footer />
    </div>
  );
}

export default MyApp;
