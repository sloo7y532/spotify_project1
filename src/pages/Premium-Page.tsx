// ...imports
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectPlan } from "../store/slices/premiumSlice.ts";
import { RootState } from "../store";
import "../styles/Premium-Page.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Accordion from "react-bootstrap/Accordion";
import '@fortawesome/fontawesome-free/css/all.min.css';


export default function PremiumPage() {
  const dispatch = useDispatch();
  const selectedPlan = useSelector((state: RootState) => state.premium.selectedPlan);

  const handleSelect = (planTitle: string) => {
    dispatch(selectPlan(planTitle));
  };

  return (
    <>
      <div className="hero-section">
        <div className="hero-images">
          <img src="https://i.etsystatic.com/35092126/r/il/26f5d7/3863487113/il_fullxfull.3863487113_hg2v.jpg" alt="Music Covers" />
        </div>
        <div className="hero-text">
          <h1>Listen without limits. Subscribe to Premium Individual for 0 SAR for one month.</h1>
          <p>Just SAR 21.99/month after. Cancel anytime.</p>
          <div className="hero-buttons">
            <button className="start-btn">Get Started</button>
            <button className="plans-btn">See All Plans</button>
          </div>
          <p className="note">*0 SAR for one month only, then 21.99 SAR/month. Offer available for users who haven’t tried Premium. Terms apply.</p>
        </div>
      </div>
      <section className="comparison-section text-white text-center py-5">
  <h2 className="fw-bold mb-3">Feel the Difference</h2>
  <p className="mb-5">
    Subscribe to <b>Spotify Premium</b> and enjoy full control over your listening. Cancel anytime.
  </p>

  <div className="container">
    <div className="row justify-content-center">
      <div className="col-lg-8 col-md-10">
        <div className="table-responsive">
          <table className="table table-bordered bg-black text-white comparison-table">
            <thead>
              <tr>
                <th className="text-start">Features You Get</th>
                <th>Spotify Free</th>
                <th>Spotify Premium</th>
              </tr>
            </thead>
            <tbody>
              {[
                { feature: "Ad-free music listening", free: "—", premium: "✔" },
                { feature: "Download to listen offline", free: "—", premium: "✔" },
                { feature: "Play songs in any order", free: "—", premium: "✔" },
                { feature: "High audio quality", free: "—", premium: "✔" },
                { feature: "Listen with friends at the same time", free: "—", premium: "✔" },
                { feature: "Organize your listening queue", free: "—", premium: "✔" },
              ].map((row, i) => (
                <tr key={i} className="comparison-row">
                  <td className="text-start fw-semibold">{row.feature}</td>
                  <td className="text-center">{row.free}</td>
                  <td className="text-center">{row.premium}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</section>

     <section className="affordable-section text-white text-center py-5">
  <h2 className="fw-bold mb-4">Affordable Plans for Every Budget</h2>
  <p className="mb-3">
    Choose any Premium subscription and enjoy ad-free music on your phone, speakers, and other devices. Pay in many ways and cancel anytime.
  </p>

  <div className="payment-methods d-flex justify-content-center gap-3 my-4">
  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/PayPal_Logo_Icon_2014.svg" alt="PayPal" className="payment-icon" />
  <img src="https://cdn-icons-png.freepik.com/256/349/349228.png" alt="American Express" className="payment-icon" />
  <img src="https://download.logo.wine/logo/Mastercard/Mastercard-Logo.wine.png" alt="MasterCard" className="payment-icon" />
  <img src="/visa.svg.png" alt="Visa" className="payment-icon" />
</div>

  <p className="mb-5">...and more</p>
  
  <div className="more-payment-icons">
    <img src="https://developer.apple.com/news/images/og/apple-pay-og.jpg" alt="Discover" />
    <img src="https://media.licdn.com/dms/image/v2/D4D05AQGm7UL8eafowQ/videocover-high/B4DZTGR10CG8Bs-/0/1738493355273?e=2147483647&v=beta&t=gB9yBKi9Si8uDIwRFs6bSLfFpSaRZMV6BUg6K-a6xoU" alt="Mada" />
  </div>

  <h3 className="fw-bold mb-3">All Premium Plans Include:</h3>
  <ul className="list-unstyled features-list mx-auto text-center mylist">
    <li>✓ Ad-free music listening</li>
    <li>✓ Download music to listen offline</li>
    <li>✓ Play songs in any order</li>
    <li>✓ High audio quality</li>
    <li>✓ Listen with friends at the same time</li>
    <li>✓ Organize your listening queue</li>
  </ul>
</section>


      <div className="premium-container">
        <section className="premium-hero">
          <h1>Go Premium. Be Happy.</h1>
          <p>Enjoy ad-free music listening, offline playback, and more.</p>
          <button className="hero-button">GET PREMIUM</button>
        </section>

        <section className="plans-section new-style-plans">
          {[
            {
              title: 'Premium Individual',
              price: 'SAR/month 18.99',
              after: '!Do not miss',
              features: [
                'One Premium account',
                'Cancel anytime',
                'Subscribe or one-time payment'
              ],
              btnText: 'Try 1 Month Free',
              color: '#fbd5dc'
            },
            {
              title: 'Premium Student',
              price: 'SAR/month 10.99',
              after: '!Be motivated',
              features: [
                'One verified Premium account',
                'Discount for eligible students',
                'Cancel anytime'
              ],
              btnText: 'Try 1 Month Free',
              color: '#d1b5e0'
            },
            {
              title: 'Premium Duo',
              price: 'SAR/month 28.99 ',
              after: '!Double trouble ',
              features: [
                'Two Premium accounts',
                'Cancel anytime',
                'Subscribe or one-time payment'
              ],
              btnText: 'Get Premium Duo',
              color: '#facc60'
            }
          ].map((plan, index) => (
            <div key={index} className="arabic-plan-card text-end">
              <div className="plan-box p-4">
                {/* <div className="high" style={ {backgroundColor: "#8d3f8d", color: "#facc60", marginLeft:"130px"}}><ul>
                  <li>Only for 20SAR</li>
                  </ul></div> */}
                <h5>Premium (ᯤ)</h5> 
                <h2 className="fw-bold text-white mb-1">{plan.title}</h2>
                <h4 className="text-white mb-0">{plan.price}</h4>
                {plan.after && <p className="small" >{plan.after}</p>}
                <ul className="list-unstyled mt-3 mb-3 text-white small">
                  {plan.features.map((feat, i) => (
                    <li key={i}>• {feat}</li>
                  ))}
                </ul>
                <button
                  className="btn fw-bold w-100 rounded-pill mb-2 border-0 plan-main-btn"
                  style={{ backgroundColor: plan.color }}
                  onClick={() => handleSelect(plan.title)}
                >
                  {plan.btnText}
                </button>
                <button className="btn btn-outline-light w-100 rounded-pill">One-time Payment</button>
              </div>
            </div>
          ))}
        </section>
   {selectedPlan && <p className="selected-plan">✅ Selected Plan: {selectedPlan}</p>}

        <section className="faq-section text-center text-white">
          <h2>Got Questions?</h2>
          <p className="lead">We're here to help.</p>
          <p className="small">Find more details on our <a href="https://open.spotify.com/" style={{color:"white"}}>Help Center.</a></p>

        <div className="accordion-wrapper mt-4">
  <Accordion defaultActiveKey="0" className="faq-accordion">
    {[
      {
        question: "How does the free trial for Spotify Premium work?",
        answer: "You get one month of free Premium with full access. After that, the regular billing starts unless you cancel. Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque laboriosam sapiente architecto laudantium cupiditate, animi doloremque dicta voluptatum tempore culpa iste dolore minima unde natus, recusandae mollitia? Ea est, repudiandae nesciunt fugit beatae incidunt possimus, fuga modi voluptate eum aliquid veritatis laboriosam deserunt praesentium."
      },
      {
        question: "How can I cancel my Premium plan?",
        answer: "Go to your account settings, select 'Subscription', and click 'Cancel Premium'. You’ll still have Premium until your next billing date."
      },
      {
        question: "How does the Premium Duo plan work?",
        answer: "Premium Duo lets two people living at the same address have separate Premium accounts under one plan for a lower price."
      },
      {
        question: "How does the Premium Family plan work?",
        answer: "Premium Family allows up to 6 accounts in one household to enjoy Premium benefits, with parental controls and a shared playlist."
      },
      {
        question: "How does the Premium Student plan work?",
        answer: "Students can verify their enrollment through a third-party service and get a 50% discount on Premium."
      },
      {
        question: "What is the cost of Spotify Premium in Saudi Arabia?",
        answer: "Premium starts at 21.99 SAR/month for individuals. Other plans like Duo, Family, and Student have different prices."
      }
    ].map((item, index) => (
      <Accordion.Item eventKey={index.toString()} key={index}>
        <Accordion.Header>{item.question}</Accordion.Header>
        <Accordion.Body>{item.answer}</Accordion.Body>
      </Accordion.Item>
    ))}
  </Accordion>
</div>

        </section>
        <footer className="custom-footer">
  <div className="footer-content">
   

    <div className="footer-columns">
      <div>
        <h5>Spotify Plans</h5>
        <ul>
          <li>Premium Individual</li>
          <li>Premium Duo</li>
          <li>Premium Family</li>
          <li>Premium Student</li>
          <li>Spotify Free</li>
        </ul>
      </div>
      <div>
        <h5>Useful Links</h5>
        <ul>
          <li>Support</li>
          <li>Web Player</li>
          <li>Free Mobile App</li>
        </ul>
      </div>
      <div>
        <h5>Communities</h5>
        <ul>
          <li>For Artists</li>
          <li>Developers</li>
          <li>Advertising</li>
          <li>Investors</li>
          <li>Vendors</li>
        </ul>
      </div>
      <div>
        <h5>Company</h5>
        <ul>
          <li>About</li>
          <li>Jobs</li>
          <li>For the Record</li>
        </ul>
      </div>
    </div>
     <div className="footer-socials">
      <a href="https://instagram.com/spotify"><i className="fab fa-facebook-f" aria-label="Facebook"></i></a>
      <a href="https://twitter.com/spotify"><i className="fab fa-x-twitter" aria-label="X (Twitter)"></i></a>
      <a href="https://www.facebook.com/Spotify"><i className="fab fa-instagram" aria-label="Instagram"></i></a>
    </div>
    <div className="footer-bottom">
      <p>Saudi Arabia (English)</p>
      <p>© Spotify AB 2025</p>
      <div className="footer-links">
        <span>Legal</span>
        <span>Privacy Center</span>
        <span>Cookies</span>
        <span>About Ads</span>
        <span>Accessibility</span>
      </div>
    </div>
  </div>
</footer>

      </div>
    </>
  );
}
