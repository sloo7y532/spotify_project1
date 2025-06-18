import '@fortawesome/fontawesome-free/css/all.min.css';
import "../styles/Premium-Page.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="custom-footer bg-black text-white py-5">
      <div className="container">
        <div className="row align-items-start mb-4">
          {/* Brand */}
          <div className="col-md-3 mb-4 mb-md-0">
            <div className="d-flex align-items-center">
              <i className="fab fa-spotify fa-2x me-2"></i>
              <span className="fs-3 fw-bold">Spotify</span>
            </div>
          </div>

          {/* Footer Columns */}
          <div className="col-md-6">
            <div className="row">
              <div className="col-4">
                <h6 className="text-uppercase fw-bold mb-3">Spotify Plans</h6>
                <ul className="list-unstyled">
                  <li>Premium Individual</li>
                  <li>Premium Duo</li>
                  <li>Premium Family</li>
                  <li>Premium Student</li>
                  <li>Spotify Free</li>
                </ul>
              </div>
              <div className="col-4">
                <h6 className="text-uppercase fw-bold mb-3">Free Mobile App</h6>
                <ul className="list-unstyled">
                  <li><a href="https://apps.apple.com/us/app/spotify-music-and-podcasts/id324684580?label=sp_cid%3Ab5db45efe9d5f848f78a33c6f10952fc&_branch_match_id=1458427087535417026&utm_source=Web&utm_campaign=DEFAULT&utm_medium=%2Fdownload+page&_branch_referrer=H4sIAAAAAAAAA8soKSkottLXLy7IL8lMq9TLyczL1s8wDUlKdvfxyc5Iss9JTErNsS0uiE%2FOTFE1dkwyTUkyMU1NS7VMMU2zMLFIM7dINDZONkszNLA0NUpLVqsrAkoWFWXmpccnFeWXF6cW2TpnFOXnpgIAWkwVQGoAAAA%3D" className="footer-link">App Store</a></li>
                  <li><a href="https://play.google.com/store/apps/details?id=com.spotify.music&hl=en_US&gl=US&label=sp_cid%3Ab5db45efe9d5f848f78a33c6f10952fc&_branch_match_id=1458427087535417026&utm_source=Web&utm_campaign=DEFAULT&utm_medium=%2Fdownload%20page&_branch_referrer=H4sIAAAAAAAAA8soKSkottLXLy7IL8lMq9TLyczL1g8xLPP2MPMussxMss9JTErNsS0uiE%2FOTFE1dkwyTUkyMU1NS7VMMU2zMLFIM7dINDZONkszNLA0NUpLVqsrAkoWFWXmpccnFeWXF6cW2TpnFOXnpgIAnRIYAWoAAAA%3D" className="footer-link">Google Play</a></li>
                  <li><a href="https://apps.microsoft.com/detail/9ncbcszsjrsb?launch=true&mode=mini&cid=spotifyweb-store-button&hl=en-US&gl=SA" className="footer-link">Microsoft</a></li>
                </ul>
              </div>
              <div className="col-4">
                <h6 className="text-uppercase fw-bold mb-3">Company</h6>
                <ul className="list-unstyled">
                  <li><Link to="/location" className="footer-link">Location</Link></li>
                  <li><a href="https://play.google.com/store/apps/details?id=com.spotify.music&hl=en_US&gl=US&label=sp_cid%3Ab5db45efe9d5f848f78a33c6f10952fc&_branch_match_id=1458427087535417026&utm_source=Web&utm_campaign=DEFAULT&utm_medium=%2Fdownload%20page&_branch_referrer=H4sIAAAAAAAAA8soKSkottLXLy7IL8lMq9TLyczL1g8xLPP2MPMussxMss9JTErNsS0uiE%2FOTFE1dkwyTUkyMU1NS7VMMU2zMLFIM7dINDZONkszNLA0NUpLVqsrAkoWFWXmpccnFeWXF6cW2TpnFOXnpgIAnRIYAWoAAAA%3D" className="footer-link">Emails</a></li>
                  <li><Link to="/about" className="footer-link">About</Link></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Social Icons */}
          <div className="col-md-3 d-flex justify-content-md-end justify-content-center gap-3">
            <a href="https://facebook.com/spotify" className="text-white fs-4">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://x.com/spotify" className="text-white fs-4">
              <i className="fab fa-x-twitter"></i>
            </a>
            <a href="https://instagram.com/spotify" className="text-white fs-4">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center border-top pt-3 mt-4">
          <p className="mb-2 mb-md-0 small">Saudi Arabia (English)</p>
          <p className="mb-2 mb-md-0 small">© Spotify AB 2025</p>
          <div className="d-flex gap-3 small flex-wrap justify-content-center">
            <span>Legal</span>
            <span>Privacy Center</span>
            <span>Cookies</span>
            <span>About Ads</span>
            <span>Accessibility</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
