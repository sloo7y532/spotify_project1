import React from "react";
import "../styles/Location-Page.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from "../components/Footer.tsx";

export default function LocationPage() {
  return (
    <div className="location-page">
      
      <div className="location-hero mt-5">
        <div className="container text-white d-flex align-items-center h-50">
          <h1 className="display-4 ">Visit Spotify HQ</h1>
        </div>
      </div>

      <div className="container py-5">
        <div className="location-info mb-5 ">
          <h2 className="header">Our Location</h2>
          <p className="text-light">
            Visit our headquarters in the heart of Stockholm or contact us for directions.
          </p>

          <div className="location-map mb-5">
            <iframe
              title="Spotify HQ Map"
              src="https://www.google.com/maps/embed?pb=!1m18..."
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              style={{ border: 0, width: '80%', height: '450px' }}
            ></iframe>
          </div>

          <div className="location-details mt-4">
            <h3 className="header-2 mb-3">Spotify HQ</h3>
            <p className="mb-1">Regeringsgatan 19</p>
            <p className="mb-1">111 53 Stockholm, Sweden</p>
            <p className="mb-1">Email: office@spotify.com</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}