import React from 'react';
<<<<<<< HEAD
import '../styles/Download-Page.css';
import Footer from '../components/Footer.tsx';
import '@fortawesome/fontawesome-free/css/all.min.css';
=======
  import '../styles/Download-Page.css';
>>>>>>> ad65bf294454bc187692d4c00cdba9d94d14fbcd

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
          <a href='https://apps.microsoft.com/detail/9ncbcszsjrsb?launch=true&mode=mini&cid=spotifyweb-store-button&hl=en-US&gl=SA' target='_blank' rel="noopener noreferrer">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Get_it_from_Microsoft_Badge.svg/1024px-Get_it_from_Microsoft_Badge.svg.png"
            alt="Microsoft Store"
            className="store-icon"
          />
          </a>

          <a href='https://apps.apple.com/us/app/spotify-music-and-podcasts/id324684580?label=sp_cid%3Ab5db45efe9d5f848f78a33c6f10952fc&_branch_match_id=1458427087535417026&utm_source=Web&utm_campaign=DEFAULT&utm_medium=%2Fdownload+page&_branch_referrer=H4sIAAAAAAAAA8soKSkottLXLy7IL8lMq9TLyczL1s8wDUlKdvfxyc5Iss9JTErNsS0uiE%2FOTFE1dkwyTUkyMU1NS7VMMU2zMLFIM7dINDZONkszNLA0NUpLVqsrAkoWFWXmpccnFeWXF6cW2TpnFOXnpgIAWkwVQGoAAAA%3D' target='_blank' rel="noopener noreferrer">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_qvDF6y80H9J3vOpLP9yk1DW3Ayv1BdH3Lw&s"
            alt="app store"
            className="store-icon"/>
            </a>

<a href='https://play.google.com/store/apps/details?id=com.spotify.music&hl=en_US&gl=US&label=sp_cid%3Ab5db45efe9d5f848f78a33c6f10952fc&_branch_match_id=1458427087535417026&utm_source=Web&utm_campaign=DEFAULT&utm_medium=%2Fdownload%20page&_branch_referrer=H4sIAAAAAAAAA8soKSkottLXLy7IL8lMq9TLyczL1g8xLPP2MPMussxMss9JTErNsS0uiE%2FOTFE1dkwyTUkyMU1NS7VMMU2zMLFIM7dINDZONkszNLA0NUpLVqsrAkoWFWXmpccnFeWXF6cW2TpnFOXnpgIAnRIYAWoAAAA%3D' target='_blank' rel="noopener noreferrer">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/2560px-Google_Play_Store_badge_EN.svg.png"
            alt="google play"
            className="store-icon"
          />
          </a>
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
      <Footer/>
    </>
  );
}
