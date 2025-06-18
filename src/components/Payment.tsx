import React from "react";
import "./Payment-Page.css";

export default function PaymentPage() {
  return (
    <div className="payment-page">
      <h1 className="text-center">Complete Your Payment</h1>

      <div className="plan-summary">
        <h2>Selected Plan</h2>
        <p className="plan-name">Premium Individual</p>
        <p className="plan-price">18.99 SAR / month</p>
      </div>

      <div className="payment-methods">
        <h3>Choose a payment method</h3>
        <div className="methods-grid">
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/PayPal_Logo_Icon_2014.svg" alt="PayPal" />
          <img src="/visa.svg.png" alt="Visa" />
          <img src="https://download.logo.wine/logo/Mastercard/Mastercard-Logo.wine.png" alt="MasterCard" />
          <img src="https://cdn-icons-png.freepik.com/256/349/349228.png" alt="American Express" />
        </div>
      </div>

      <form className="payment-form">
        <h3>Payment Details</h3>
        <input type="text" placeholder="Cardholder Name" required />
        <input type="text" placeholder="Card Number" required />
        <div className="form-row">
          <input type="text" placeholder="MM/YY" required />
          <input type="text" placeholder="CVV" required />
        </div>
        <button type="submit">Pay Now</button>
      </form>
    </div>
  );
}
