import React from "react";
import "../styles/Location-Page.css";
import Footer from "../components/Footer.tsx";

export default function LocationPage() {
  return (
    <div className="location-page">
      <div className="container">
        <div className="location-info mb-5">
          <h1>Our Location</h1>
          <p>Visit our headquarters in the heart of Stockholm or contact us for directions.</p>
          <div className="location-details">
            <h2>Spotify HQ</h2>
            <p>Regeringsgatan 19</p>
            <p>111 53 Stockholm, Sweden</p>
            <p>Email: office@spotify.com</p>
          </div>
        </div>

        <div className="location-map mb-5">
          <iframe
            title="Spotify HQ Map"
            src="https://www.google.com/maps/embed?pb=!1m18..."
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            style={{ border: 0, width: '100%', height: '400px' }}
          ></iframe>
        </div>
      </div>
      <Footer />
    </div>
  );
}