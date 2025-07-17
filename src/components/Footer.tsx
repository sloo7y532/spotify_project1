
// Importing core libraries and dependencies
import React from "react";
import { useTranslation } from "react-i18next";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../styles/Footer.css"; 
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="custom-footer bg-black text-white py-5">
      <div className="container">
        <div className="row align-items-start mb-4">
          {/* Logo */}
          <div className="col-md-3 mb-4 mb-md-0">
            <div className="brand-spotify">
              <i className="fab fa-spotify fa-2x"></i>
              <span className="ms-1 fs-3 fw-bold">Spotify</span>
            </div>
          </div>

          {/* Footer columns */}
          <div className="col-md-6">
            <div className="row">
              <div className="col-6">
                <h6 className="text-uppercase fw-bold mb-3">{t("footer.freeApp")}</h6>
                <ul className="list-unstyled">
                  <li><a href="https://apps.apple.com/..." className="footer-link">{t("footer.appStore")}</a></li>
                  <li><a href="https://play.google.com/..." className="footer-link">{t("footer.googlePlay")}</a></li>
                  <li><a href="https://apps.microsoft.com/..." className="footer-link">{t("footer.microsoftStore")}</a></li>
                </ul>
              </div>
              <div className="col-6">
                <h6 className="text-uppercase fw-bold mb-3">{t("footer.company")}</h6>
                <ul className="list-unstyled">
                  <li><Link to="/location" className="footer-link">{t("footer.location")}</Link></li>
                  <li><Link to="/job" className="footer-link">{t("footer.jobs")}</Link></li>
                  <li><Link to="/about" className="footer-link">{t("footer.about")}</Link></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Social Icons */}
          <div className="col-md-3 d-flex justify-content-md-end justify-content-center gap-3">
            <a href="https://facebook.com/spotify" className="text-white fs-4"><i className="fab fa-facebook-f"></i></a>
            <a href="https://x.com/spotify" className="text-white fs-4"><i className="fab fa-x-twitter"></i></a>
            <a href="https://instagram.com/spotify" className="text-white fs-4"><i className="fab fa-instagram"></i></a>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center border-top pt-3 mt-4">
          <p className="mb-2 mb-md-0 small">{t("footer.language")}</p>
          <p className="mb-2 mb-md-0 small">{t("footer.copyright")}</p>
          <div className="d-flex gap-3 small flex-wrap justify-content-center">
            <a href="https://www.spotify.com/sa-ar/legal/end-user-agreement/"><span>{t("footer.legal")}</span></a>
            <a href="https://www.spotify.com/sa-ar/legal/privacy-policy/"><span>{t("footer.privacy")}</span></a>
            <a href="https://www.spotify.com/sa-ar/accessibility"><span>{t("footer.accessibility")}</span></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
