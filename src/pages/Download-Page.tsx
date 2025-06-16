import React from 'react';
  import '../styles/Download-Page.css';

export default function DownloadPage() {
  return (
    <>
      <section className="download-hero-section">
        <div className="overlay text-center text-white d-flex flex-column justify-content-center align-items-center">
          <h1 className="fw-bold mb-3">Download Spotify</h1>
          <p className="lead mb-4">Play millions of songs and podcasts on your device.</p>
          <a
            href="https://www.spotify.com/download/"
            className="download-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download directly from Spotify
          </a>
        </div>
      </section>

      <section className="platform-section text-center py-5 bg-white text-dark">
        <h2 className="fw-bold mb-3">Get Spotify on your device</h2>
        <p className="mb-4">Download the app to start listening for free.</p>
        <div className="platform-icons d-flex justify-content-center gap-3 flex-wrap">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Get_it_from_Microsoft_Badge.svg/1024px-Get_it_from_Microsoft_Badge.svg.png"
            alt="Microsoft Store"
            className="store-icon"
          />
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_qvDF6y80H9J3vOpLP9yk1DW3Ayv1BdH3Lw&s"
            alt="Google Play"
            className="store-icon"
          />
          <img
            src="https://flet.dev/img/docs/getting-started/testing-on-android/google-play-badge.png"
            alt="App Store"
            className="store-icon"
          />
        </div>
      </section>
      <section className="devices-banner-section d-flex flex-column justify-content-between text-white text-center">
        <div></div> 
        <div className="mb-3">
          <h2 className="fw-bold mb-3">One account, listen anywhere</h2>
          <p className="device-list fw-bold">
            Mobile • Computer • Tablet • Car • PlayStation® • Xbox • TV • Speakers • Web Player
          </p>
        </div>
      </section>
    </>
  );
}
