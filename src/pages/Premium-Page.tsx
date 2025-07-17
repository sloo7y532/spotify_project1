// Importing core libraries and dependencies
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectPlan } from "../store/slices/premiumSlice.ts";
import { RootState } from "../store";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";

// Importing styles and UI libraries
import "../styles/Premium-Page.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Accordion from "react-bootstrap/Accordion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Importing reusable components
import Footer from "../components/Footer.tsx";
import Premium from "../components/Premium.tsx";
import PremiumKids from "../components/PremiumKids.tsx";

// Main component for the Premium Subscription Page
export default function PremiumPage() {
  // Localization hook
  const { t, i18n } = useTranslation();

  // Accessing translated FAQ and Plan data from i18n
  const faqItems = t("faq.items", { returnObjects: true }) as {
    question: string;
    answer: string;
  }[];
  const plans = t("plansList", { returnObjects: true }) as Array<{
    title: string;
    price: string;
    priceValue: number;
    expiresInDays: number;
    after: string;
    features: string[];
    btnText: string;
    color: string;
  }>;
  const user = useSelector((state: RootState) => state.auth.user);

  // Redux and navigation hooks
  const dispatch = useDispatch();
  const selectedPlan = useSelector(
    (state: RootState) => state.premium.selectedPlan
  );
  const navigate = useNavigate();

  // Local state for hover effects and payment form inputs
  const [hovered, setHovered] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showStudentPopup, setShowStudentPopup] = useState(false);
  const [studentEmail, setStudentEmail] = useState("");
  const [isStudentVerified, setIsStudentVerified] = useState(false);
  const [userPlan, setUserPlan] = useState<string | null>(null);
  const [showAlreadySubscribedModal, setShowAlreadySubscribedModal] =
    useState(false);

  // Handle plan selection: dispatch to Redux and save to Firebase
  const handleSelect = async (plan: {
    title: string;
    price: string;
    priceValue: number;
    expiresInDays: number;
  }) => {
    if (!user) {
      navigate("/login");
      toast.info("Please sign in to continue.");
      return;
    }

    if (userPlan) {
      setShowAlreadySubscribedModal(true);
      return;
    }

    const isStudentPlan =
      plan.title === "Premium Student" || plan.title === "بريميوم طلاب";

    setIsStudentVerified(false);
    setStudentEmail("");

    dispatch(selectPlan(plan.title));

    if (isStudentPlan) {
      setShowStudentPopup(true);
      return;
    }

    // ✅ Normal non-student plan saving
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + plan.expiresInDays);

    const data = {
      plan: plan.title,
      price: plan.priceValue,
      createdAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString(),
      userId: user.id,
      email: user.email,
    };

    try {
      await axios.post(
        "https://spotify-project-123-default-rtdb.firebaseio.com/selectedPlans.json",
        data
      );
    } catch (err) {
      console.error("Error saving selected plan:", err);
    }
  };

  useEffect(() => {
    const fetchUserPlan = async () => {
      if (!user || !user.email) return;
      try {
        const res = await axios.get(
          "https://spotify-project-123-default-rtdb.firebaseio.com/selectedPlans.json"
        );
        const data = res.data;

        const entries = Object.values(data || {}) as any[];
        const userEmail = user.email.trim().toLowerCase();

        const myPlan = entries.find((entry) => entry.userId === user.id);

        console.log("usesr email", userEmail);
        console.log("user ", user);
        console.log("userPlan:", userPlan);

        if (myPlan?.plan) setUserPlan(myPlan.plan);
      } catch (err) {
        console.error("Failed to fetch user plan:", err);
      }
    };
    fetchUserPlan();
  }, [user]);

  return (
    <>
      {/* Toast messages container for user feedback */}
      <ToastContainer position="top-center" autoClose={3000} />

      {/* Hero section with navigation buttons */}
      <div className="hero-section">
        {/* Hero image */}
        <div className="hero-images">
          <img
            src="https://i.etsystatic.com/35092126/r/il/26f5d7/3863487113/il_fullxfull.3863487113_hg2v.jpg"
            alt="Music Covers"
          />
        </div>
        {/* Hero text and CTA buttons */}
        <div className="hero-text">
          <h1>{t("hero.title")}</h1>
          <p>{t("hero.subtitle")}</p>
          <div className="hero-buttons justify-content-center">
            <button
              onClick={() => navigate("/login")}
              className="start-btn me-4"
            >
              {t("hero.button.start")}
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("plans")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="plans-btn"
            >
              {t("hero.button.plans")}
            </button>
          </div>
          <p className="note mt-3">{t("hero.note")}</p>
        </div>
      </div>

      {/* Feature comparison table between Free and Premium */}
      <section>
        <h2 className="fw-bold text-center mt-5">{t("comparison.title")}</h2>
        <p>{t("comparison.description")}</p>
        <div className="comparison-section container text-white py-5">
          <table className="table table-bordered bg-black text-white comparison-table">
            <thead>
              <tr>
                <th>
                  {t("comparison.featuresTitle")}{" "}
                  <i className="fab fa-spotify fa-2x ms-2" />
                </th>
                <th>{t("comparison.free")}</th>
                <th>{t("comparison.premium")}</th>
              </tr>
            </thead>
            <tbody>
              {[
                "adFree",
                "offlineDownload",
                "anyOrder",
                "highQuality",
                "listenTogether",
                "queueControl",
              ].map((key, i) => (
                <tr key={i}>
                  <td className="fw-semibold">
                    {t(`comparison.features.${key}`)}
                  </td>
                  <td className="text-center">—</td>
                  <td className="text-center">✔</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section showcasing supported payment methods and features */}
      <section className="affordable-section text-white text-center py-5">
        <h2 className="fw-bold mb-4">{t("affordable.title")}</h2>
        <p>{t("affordable.description")}</p>
        <div className="payment-methods d-flex justify-content-center gap-3 my-4">
          {/* Payment icons */}
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/b/b7/PayPal_Logo_Icon_2014.svg"
            alt="PayPal"
            className="payment-icon"
          />
          <img
            src="https://cdn-icons-png.freepik.com/256/349/349228.png"
            alt="American Express"
            className="payment-icon"
          />
          <img
            src="https://download.logo.wine/logo/Mastercard/Mastercard-Logo.wine.png"
            alt="MasterCard"
            className="payment-icon"
          />
          <img src="/visa.svg.png" alt="Visa" className="payment-icon" />
          {/* more icons */}
        </div>

        {/* Hover-reveal additional payment methods */}
        <div className="hover-area text-center my-5">
          <p
            className="hover-text"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {t("affordable.more")}
          </p>
          {hovered && (
            <div className="image-box mt-3">
              <img
                src="https://play-lh.googleusercontent.com/aqVjPx-JDaqoD6oyMDmqF24pVko-1p9LAnKyq6k6JycVrMMvXONfAruYfhFHeiJCfwo"
                alt="StcPay"
              />
              <img
                src="https://www.logo.wine/a/logo/Apple_Pay/Apple_Pay-White-Dark-Background-Logo.wine.svg"
                alt="ApplePay"
              />
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlJeSetovZYxcpQmPuM-fu7k2EzUcVb3qU0w&s"
                alt="Mada"
              />
            </div>
          )}
        </div>

        {/* List of Premium features */}
        <h3 className="fw-bold mb-3">{t("plans.includes")}</h3>
        <ul className="list-unstyled features-list mx-auto text-center mylist">
          <li>{t("features.items.adFree")}</li>
          <li>{t("features.items.offline")}</li>
          <li>{t("features.items.anyOrder")}</li>
          <li>{t("features.items.quality")}</li>
          <li>{t("features.items.friends")}</li>
          <li>{t("features.items.queue")}</li>
          {/* etc. */}
        </ul>
      </section>

      {/* Subscription plans section with plan cards */}
      <section
        className="plans-section new-style-plans"
        id="plans"
        dir={i18n.language === "ar" ? "rtl" : "ltr"}
      >
        {plans?.map((plan, index) => (
          <div key={index} className="arabic-plan-card">
            <div className="plan-box p-4">
              <h5>
                <i className="fa-brands fa-spotify"></i> Premium
              </h5>
              <h2 style={{ color: plan.color }}>{plan.title}</h2>
              <h4>{plan.price}</h4>
              {plan.after && <p>{plan.after}</p>}
              <ul className="text-white small">
                {plan.features.map((feat, i) => (
                  <li key={i}>{feat}</li>
                ))}
              </ul>
              <button
                className="btn w-100 rounded-pill border-0"
                style={{ backgroundColor: plan.color }}
                onClick={() => handleSelect(plan)}
              >
                {plan.btnText}
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* Payment form shown only when a plan is selected */}
      {selectedPlan &&
        selectedPlan !== userPlan && // Block if already subscribed
        ((selectedPlan !== "Premium Student" &&
          selectedPlan !== "بريميوم طلاب") ||
          isStudentVerified) && (
          <div className="payment-form bg-light p-4 rounded my-4">
            <h4 className="text-success mb-3">
              {t("Complete")} {selectedPlan}
            </h4>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setIsSubmitting(true);

                // Input validation for credit card details
                const rawCardNumber = cardNumber.replace(/\s/g, "");

                if (!rawCardNumber.match(/^4\d{15}$/)) {
                  toast.error(
                    "Card number must be 16 digits and start with '4'"
                  );
                  setIsSubmitting(false);
                  return;
                }
                if (cvv.length < 3 || cvv.length > 4) {
                  toast.error("CVV must be 3 or 4 digits");
                  setIsSubmitting(false);
                  return;
                }
                if (!expiryDate.match(/^\d{2}\/\d{2}$/)) {
                  toast.error("Expiry date must be in MM/YY format");
                  setIsSubmitting(false);
                  return;
                }

                // Calculate expiry date and prepare payment data
                const selectedPlanDetails = plans.find(
                  (p) => p.title === selectedPlan
                );
                const expiresAt = new Date();
                expiresAt.setDate(
                  expiresAt.getDate() +
                    (selectedPlanDetails?.expiresInDays || 30)
                );

                const paymentData = {
                  plan: selectedPlan,
                  fullName,
                  price: selectedPlanDetails?.priceValue || 0,
                  expiresAt: expiresAt.toISOString(),
                  createdAt: new Date().toISOString(),
                };

                try {
                  await axios.post(
                    "https://spotify-project-123-default-rtdb.firebaseio.com/selectedPlans.json",
                    paymentData
                  );
                  toast.success("Payment submitted successfully!");
                  setFullName("");
                  setCardNumber("");
                  setExpiryDate("");
                  setCvv("");
                } catch (err) {
                  console.error("Payment submission failed:", err);
                  toast.error("Error submitting payment.");
                } finally {
                  setIsSubmitting(false); // Enable button again
                }
              }}
            >
              {/* Form fields for full name, card number, expiry date, and CVV */}
              {/* ...inputs... */}
              <div className="mb-3 text-start">
                <label className="form-label text-light mt-3 mb-0">
                  Full Name
                </label>
                <input
                  type="text"
                  className="form-control text-start"
                  placeholder="Name on card "
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />

                <div className="mb-3">
                  <label className="form-label text-light mt-3 mb-0 text-start">
                    Card Number
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="4234 5678 9012 3456"
                    maxLength={19}
                    value={cardNumber}
                    onChange={(e) => {
                      let val = e.target.value.replace(/[^\d]/g, "");
                      if (val.length > 16) val = val.slice(0, 16);
                      if (val.length > 12)
                        val =
                          val.slice(0, 4) +
                          " " +
                          val.slice(4, 8) +
                          " " +
                          val.slice(8, 12) +
                          " " +
                          val.slice(12);
                      else if (val.length > 8)
                        val =
                          val.slice(0, 4) +
                          " " +
                          val.slice(4, 8) +
                          " " +
                          val.slice(8);
                      else if (val.length > 4)
                        val = val.slice(0, 4) + " " + val.slice(4);
                      setCardNumber(val);
                    }}
                    required
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-light mt-3 mb-0 text-start">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="MM/YY"
                      maxLength={5}
                      value={expiryDate}
                      onChange={(e) => {
                        let val = e.target.value.replace(/[^\d]/g, "");

                        if (val.length >= 3) {
                          let month = val.slice(0, 2);
                          let year = val.slice(2, 4);

                          // Ensure month is between 01 and 12
                          if (parseInt(month) > 12) month = "12";
                          if (parseInt(month) === 0) month = "01";

                          // Ensure year is max 40
                          if (parseInt(year) > 40) year = "40";
                          if (parseInt(year) < 25) year = "25";

                          val = month + "/" + year;
                        }

                        setExpiryDate(val.slice(0, 5));
                      }}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-light mt-3 mb-0 text-start">
                      CVV
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="123"
                      maxLength={3}
                      value={cvv}
                      onChange={(e) => {
                        const onlyNums = e.target.value.replace(/\D/g, "");
                        setCvv(onlyNums);
                      }}
                      required
                    />
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-success w-100"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Processing..."
                ) : (
                  <>
                    Pay Now <i className="bi bi-credit-card-fill"></i>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

      {/* Frequently Asked Questions (FAQ) section */}
      <section
        className="faq-section text-center text-white"
        dir={i18n.language === "ar" ? "rtl" : "ltr"}
      >
        <div className="mx-auto" style={{ maxWidth: "850px" }}>
          {/*handle it manually */}
          <h2>{t("faq.title")}</h2>
          <p className="lead">{t("faq.subtitle")}</p>
          <Accordion defaultActiveKey="0" className="faq-accordion">
            {faqItems.map((item, index) => (
              <Accordion.Item eventKey={index.toString()} key={index}>
                <Accordion.Header>{item.question}</Accordion.Header>
                <Accordion.Body>{item.answer}</Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </div>
      </section>
      {/*Student check*/}

      {showStudentPopup && (
        <div className="modal d-block" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Student Verification</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowStudentPopup(false);
                    setStudentEmail("");
                    dispatch(selectPlan("")); // Optionally clear selected plan
                  }}
                />
              </div>

              <div className="modal-body">
                <p>
                  Please enter your student email to verify your eligibility.
                </p>
                <input
                  type="email"
                  className="form-control"
                  placeholder="your@student.edu"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                />
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowStudentPopup(false);
                    setStudentEmail("");
                    dispatch(selectPlan("")); // Optional
                  }}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-secondary"
                  onClick={async () => {
                    if (!studentEmail.includes("edu")) {
                      toast.error(
                        "Please enter a valid student email (e.g., your@student.edu)"
                      );
                      return;
                    }

                    try {
                      await axios.post(
                        "https://spotify-project-123-default-rtdb.firebaseio.com/selectedPlans.json",
                        {
                          email: user?.email,
                          userId: user?.id,
                          plan: "Premium Student",
                          submittedAt: new Date().toISOString(),
                          expiresAt: new Date(
                            new Date().setDate(new Date().getDate() + 30)
                          ).toISOString(),
                          createdAt: new Date().toISOString(),
                        }
                      );

                      toast.success("Email verified!");
                      setIsStudentVerified(true);
                      setShowStudentPopup(false);
                      dispatch(selectPlan("Premium Student")); // Re-trigger rendering
                    } catch (err) {
                      toast.error("Submission failed. Try again.");
                    }
                  }}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* banner componnent */}
      {[
        "premium individual",
        "premium student",
        "بريميوم فردي",
        "بريميوم الطلاب",
      ].includes(userPlan?.toLowerCase() || "") && <Premium />}

      {["premium kids", "بريميوم الاطفال"].includes(
        userPlan?.toLowerCase() || ""
      ) && <PremiumKids />}

      {/* already sub section */}

      {showAlreadySubscribedModal && (
        <div
          className="modal fade show d-block custom-modal-backdrop"
          role="dialog"
        >
          <div className="modal-dialog">
            <div className="modal-content custom-modal-content">
              <div className="modal-header custom-modal-header">
                <h5 className="modal-title">
                  {t("alreadySubscribed.modalTitle")}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAlreadySubscribedModal(false)}
                />
              </div>
              <div className="modal-body">
                <p>{t("alreadySubscribed.modalMessage")}</p>
              </div>
              <div className="modal-footer custom-modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowAlreadySubscribedModal(false)}
                >
                  {t("Close")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Footer component */}
      <Footer />
    </>
  );
}
