import React, { useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useRouter } from "next/router";
import Image from "next/image";
import SuccessPopup from "./SuccessPopup";

const PackageCard = ({ id, imgSrc, packageName, destinations, price, duration }) => {
  const router = useRouter();
  const [showCallbackForm, setShowCallbackForm] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const formattedPrice = isNaN(parseFloat(price)) ? "N/A" : `₹${parseFloat(price).toLocaleString()}`;

  const locations = Array.isArray(destinations) && destinations.length > 0
    ? destinations.filter(Boolean).join(" | ")
    : "No Destinations Available";

  const handleCallbackRequest = (e) => {
    e.stopPropagation();
    setShowCallbackForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://desire4travels-1.onrender.com/callback-package', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNo: mobileNumber,
          package: packageName,
          called: false,
        }),
      });

      if (response.ok) {
        setShowCallbackForm(false);
        setMobileNumber('');
        setShowSuccessPopup(true);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Failed to send callback request. Please try again later.');
    }
  };

  const handleCardClick = () => {
    router.push(`/package/${id}`);
  };

  return (
    <>
      {showSuccessPopup && (
        <SuccessPopup
          message="Your callback request has been submitted successfully."
          onClose={() => setShowSuccessPopup(false)}
        />
      )}

      <div className="package-card-wrapper">
        <div className="package-card cursor-pointer" onClick={handleCardClick}>
          <Image
            src={imgSrc}
            alt={packageName}
            className="package-image"
            width={400}
            height={250}
            style={{ objectFit: "cover" }}
            unoptimized={true}
          />
          <div className="card-content">
            <h2 className="package-title1" title={packageName}>
              {packageName.length > 25 ? `${packageName.slice(0, 25)}...` : packageName}
            </h2>

            <p className="location">
              <FaMapMarkerAlt /> {locations}
            </p>
            <p className="price">{formattedPrice}</p>
            <p className="duration">{duration}</p>
            <button className="request-btn" onClick={handleCallbackRequest}>Request Call Back</button>

            {showCallbackForm && (
              <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
                <div>
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="Enter Mobile Number"
                    required
                  />
                </div>
                <button type="submit">Submit</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PackageCard;
