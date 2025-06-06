import React, { useState, useRef, useEffect } from "react";
import SwiperCore, { Autoplay } from "swiper";  // <-- Import SwiperCore and Autoplay
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import "swiper/css";

SwiperCore.use([Autoplay]);  // <-- Register Autoplay globally

const PackageDetails = ({ packageData, error }) => {
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    travelers: "",
    date: "",
  });
  const [expandedCards, setExpandedCards] = useState({});

  const leftRef = useRef(null);
  const rightRef = useRef(null);

  if (error) return <div>{error}</div>;
  if (!packageData) return <div>Package not found</div>;

  const {
    packageName,
    duration,
    price,
    photo,
    description,
    inclusions = "",
    itinerary = "",
    destinations = [],
  } = packageData;

  const inclusionsArray =
    typeof inclusions === "string"
      ? inclusions.split(";").map((i) => i.trim()).filter(Boolean)
      : Array.isArray(inclusions)
      ? inclusions
      : [];

  const itineraryArray =
    typeof itinerary === "string"
      ? itinerary.split(";").map((i) => i.trim()).filter(Boolean)
      : Array.isArray(itinerary)
      ? itinerary
      : [];

  const dayHeaderRegex = /^day\s*\d+\s*:/i;
  const days = [];
  let currentDay = null;

  itineraryArray.forEach((item) => {
    if (dayHeaderRegex.test(item)) {
      if (currentDay) days.push(currentDay);
      currentDay = { dayLabel: true, fullHeading: item, activities: [] };
    } else {
      if (currentDay) {
        currentDay.activities.push(item);
      } else {
        days.push({ dayLabel: null, activities: [item] });
      }
    }
  });
  if (currentDay) days.push(currentDay);

  const toggleReadMore = (key) => {
    setExpandedCards((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleScroll = () => {
    const left = leftRef.current;
    const right = rightRef.current;
    if (!left || !right) return;
    const maxLeftScroll = left.scrollHeight - left.clientHeight;
    const isLeftFullyScrolled = left.scrollTop >= maxLeftScroll;

    if (isLeftFullyScrolled) {
      right.scrollTop = left.scrollTop - maxLeftScroll;
    } else {
      right.scrollTop = 0;
    }
  };

  useEffect(() => {
    const left = leftRef.current;
    if (left) {
      left.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (left) left.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!packageData) {
      alert("Package data not loaded. Please try again.");
      return;
    }
    try {
      const payload = {
        ...formData,
        packageName: packageData.packageName,
      };
      await axios.post(
        "https://desire4travels-1.onrender.com/api/custom-quotes",
        payload
      );
      alert("Request submitted successfully!");
      setShowQuoteForm(false);
      setFormData({ name: "", mobile: "", travelers: "", date: "" });
    } catch (err) {
      console.error("Submission failed:", err);
      alert("Failed to submit request.");
    }
  };

  const DestinationsJSX = (
    <section className="package-details-section">
      <h1 className="package-title package-details-destinations-title">
        Destinations Covered
      </h1>
      <div className="package-details-destinations-grid">
        {destinations.length ? (
          destinations.map((dest, i) => (
            <div key={i} className="package-details-destination-card">
              <img
                src={dest.image}
                alt={dest.name}
                className="package-details-destination-image"
              />
              <h3 className="destination-title">{dest.name}</h3>
            </div>
          ))
        ) : (
          <p>No destinations available.</p>
        )}
      </div>
    </section>
  );

  return (
    <div className="package-details-container">
      <div className="mobile-slider mobile-only">
        <Swiper
          spaceBetween={16}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
        >
          <SwiperSlide>
            <div className="slider-image-container">
              <img src={photo} alt={packageName} />
            </div>
          </SwiperSlide>
          {[
            "/assets/Hotel.png",
            "/assets/Taxi.png",
            "/assets/Passport.png",
            "/assets/Flight.png",
          ].map((imgSrc, index) => (
            <SwiperSlide key={index}>
              <div className="slider-image-container">
                <Image
                  src={imgSrc}
                  alt={`Slide ${index + 1}`}
                  width={300}
                  height={200}
                  objectFit="contain"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="package-details-header-flex premium-package-header-wrapper">
        <section className="premium-package-header-section">
          <h1 className="premium-package-title">{packageName}</h1>
          <h2 className="premium-package-duration">🕒 {duration}</h2>
          <h3 className="premium-package-price">💰 ₹{price}</h3>
        </section>
      </div>

      <div className="package-details-header-flex">
        <div className="desktop-only">
          <img
            src={photo}
            alt={packageName}
            className="package-details-main-image"
          />
        </div>

        <div className="package-details-icons desktop-only">
          <Image
            src="/assets/Hotel.png"
            alt="Hotel"
            width={50}
            height={50}
            className="package-icon"
          />
          <Image
            src="/assets/Taxi.png"
            alt="Taxi"
            width={50}
            height={50}
            className="package-icon"
          />
        </div>
        <div className="package-details-icons desktop-only second-margin">
          <Image
            src="/assets/Passport.png"
            alt="Passport"
            width={50}
            height={50}
            className="package-icon"
          />
          <Image
            src="/assets/Flight.png"
            alt="Flight"
            width={50}
            height={50}
            className="package-icon"
          />
        </div>
      </div>

      <div className="package-details-flex-wrapper">
        <div className="package-details-left" ref={leftRef}>
          <section className="package-details-section">
            <h1 className="package-title">About the Package</h1>
            <div
              className={`package-description ${
                expandedCards["about"] ? "expanded" : "collapsed"
              }`}
              dangerouslySetInnerHTML={{ __html: description || "" }}
            />
            {description && description.split(" ").length > 50 && (
              <button
                className="read-more-btn"
                onClick={() => toggleReadMore("about")}
              >
                {expandedCards["about"] ? "Read less" : "Read more"}
              </button>
            )}
          </section>

          <div className="mobile-only">{DestinationsJSX}</div>

          <section className="package-details-section">
            <h1 className="package-title">Inclusions</h1>
            {inclusionsArray.length ? (
              <ul className="package-details-list">
                {inclusionsArray.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>No inclusions available.</p>
            )}
          </section>

          <section className="package-details-section">
            <h1 className="package-title">Itinerary</h1>
            <table className="itinerary-table">
              <tbody>
                {days.length ? (
                  days.map((day, i) => (
                    <React.Fragment key={i}>
                      {day.dayLabel && (
                        <tr className="itinerary-day-row">
                          <td colSpan="2">{day.fullHeading}</td>
                        </tr>
                      )}
                      {day.activities.map((act, j) => (
                        <tr key={`${i}-${j}`} className="itinerary-item-row">
                          <td colSpan="2">{act}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2">No itinerary available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        </div>

        <div className="package-details-right" ref={rightRef}>
          <div className="desktop-only">{DestinationsJSX}</div>
        </div>
      </div>

      <button
        className="request-package-button"
        onClick={() => setShowQuoteForm(true)}
      >
        Get customise quote
      </button>

      {showQuoteForm && (
        <div
          className="quote-popup-overlay"
          onClick={() => setShowQuoteForm(false)}
        >
          <div className="quote-popup" onClick={(e) => e.stopPropagation()}>
            <h1 className="package-title">Get Customized Quote</h1>
            <form className="quote-form" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="tel"
                name="mobile"
                placeholder="Mobile Number"
                value={formData.mobile}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="travelers"
                placeholder="Number of Travelers"
                min="1"
                value={formData.travelers}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="date"
                placeholder="Preferred Travel Date"
                value={formData.date}
                onChange={handleChange}
                required
                min={new Date().toISOString().split("T")[0]}
              />
              <button type="submit">Submit Request</button>
            </form>
            <button
              onClick={() => setShowQuoteForm(false)}
              className="close-popup-button"
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export async function getServerSideProps(context) {
  const { packageId } = context.params;

  try {
    const response = await axios.get(
      `https://desire4travels-1.onrender.com/api/packages/${packageId}`
    );

    if (!response.data) {
      return { notFound: true };
    }

    return {
      props: {
        packageData: response.data,
      },
    };
  } catch (error) {
    return {
      props: {
        packageData: null,
        error: "Failed to load package details.",
      },
    };
  }
}

export default PackageDetails;
