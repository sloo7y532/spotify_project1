// ...imports
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectPlan } from "../store/slices/premiumSlice.ts";
import { RootState } from "../store";
<<<<<<< HEAD
import { useState } from "react";
=======
>>>>>>> ad65bf294454bc187692d4c00cdba9d94d14fbcd
import "../styles/Premium-Page.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Accordion from "react-bootstrap/Accordion";
import '@fortawesome/fontawesome-free/css/all.min.css';
import Footer from "../components/Footer.tsx";



export default function PremiumPage() {
  const dispatch = useDispatch();
   const [hovered, setHovered] = useState(false);
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
          <div className="hero-buttons justify-content-center">
            <button className="start-btn">Get Started</button>
            <button className="plans-btn">See All Plans</button>
          </div>
          <p className="note">*0 SAR for one month only, then 21.99 SAR/month. Offer available for users who haven’t tried Premium. Terms apply.</p>
        </div>
      </div>
      <section className="">
  <h2 className="fw-bold mb-2 mt-4 text-center ">Feel the Difference</h2>
  <p className="mb-3">
    Subscribe to <b>Spotify Premium</b> and enjoy full control over your listening. Cancel anytime.
  </p>

  <div className="comparison-section text-white text-center py-5 container">
    <div className="row justify-content-center">
      <div className="col-lg-8 col-md-10">
        <div className="table-responsive">
          <table className="table table-bordered bg-black text-white comparison-table">
            <thead>
              <tr>
                <th className="text-start">Features You Get <i className="fs-6 fab fa-spotify fa-2x me-2"></i></th>
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
    <div className="hover-area text-center my-5">
      <p
        className="hover-text"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        and more..
      </p>

      {hovered && (
        <div className="image-box mt-3">
          <img src="https://play-lh.googleusercontent.com/aqVjPx-JDaqoD6oyMDmqF24pVko-1p9LAnKyq6k6JycVrMMvXONfAruYfhFHeiJCfwo=w480-h960-rw" alt="StcPay" />
          <img src="https://www.logo.wine/a/logo/Apple_Pay/Apple_Pay-White-Dark-Background-Logo.wine.svg" alt="ApplePay" />
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlJeSetovZYxcpQmPuM-fu7k2EzUcVb3qU0w&s" alt="Mada" />
        </div>
      )}
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
              color: '#d1b5e0',
              
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
            <div key={index} className="arabic-plan-card text-start">
              <div className="plan-box p-4">
                {/* <div className="high" style={ {backgroundColor: "#8d3f8d", color: "#facc60", marginLeft:"130px"}}><ul>
                  <li>Only for 20SAR</li>
                  </ul></div> */}
                <h5 className="text-start"> <i className="fa-brands fa-spotify"></i> Premium </h5> 
                <h2 className="fw-bold mb-1"style={{ color: plan.color }}>{plan.title}</h2>
                <h4 className="text-white mb-0">{plan.price}</h4>
                {plan.after && <p className="text-start">{plan.after}</p>}
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
<Footer/>
      </div>
    </>
  );
}
