import React from "react";
import "../styles/About-Page.css";
import Footer from "../components/Footer.tsx";

export default function AboutPage() {
  return (
    <div className="about-page">
      <section className="about-content">
        <h1>About Us</h1>
        <p>
          With Spotify, it’s easy to find the right music or podcast for every moment — on your phone,
          your computer, your tablet and more.
        </p>
        <p>
          There are millions of tracks and episodes on Spotify. So whether you’re behind the wheel,
          working out, partying or relaxing, the right music or podcast is always at your fingertips.
          Choose what you want to listen to, or let Spotify surprise you.
        </p>
        <p>
          You can also browse through the collections of friends, artists, and celebrities, or create a
          radio station and just sit back.
        </p>
        <p>
          Soundtrack your life with Spotify. Subscribe or listen for free.
        </p>

        <h2>Customer Service and Support</h2>
        <ol className="support-list">
          <li>
            <strong><a href="https://www.spotify.com/us/about-us/contact/">Help site</a>.</strong> Check out our help site for answers to your
            questions and to learn how to get the most out of Spotify and your music.
          </li>
          <li>
            <strong><a href="https://www.spotify.com/us/about-us/contact/">Community</a>.</strong> Get fast support from expert Spotify users.
            If there isn’t already an answer there, you can post it and someone will quickly help.
          </li>
          <li>
            <strong><a href="https://www.spotify.com/us/about-us/contact/">Contact us</a>.</strong> Contact our Customer Support if you don’t find
            a solution on our support site or Community.
          </li>
          <li>
            <strong><a href="https://www.spotify.com/us/about-us/contact/">@SpotifyCares</a>.</strong> Feeling sociable? Tweet the team and they’ll
            do their best to help.
          </li>
        </ol>
      </section>

      <aside className="about-sidebar">
        <div>
          <h2>Spotify HQ</h2>
          <p><strong>Spotify AB</strong></p>
          <p>Regeringsgatan 19<br />SE-111 53 Stockholm<br />Sweden</p>
          <p>Reg no: 556703-7485<br />office@spotify.com</p>
        </div>

        <div>
          <h2>Spotify around the world</h2>
          <div className="world-locations">
            <div>
              <p><strong>Spotify Belgium</strong><br />Square de Meeus 37<br />4th floor<br />1000 Brussels<br />Belgium<br />office@spotify.com</p>
            </div>
            <div>
              <p><strong>Spotify India LLP</strong><br />Jet Airways - Godrej BKC<br />1st Floor, Unit 1 and 2,<br />Plot C-68, G Block,<br />Bandra Kurla Complex,<br />Mumbai Suburban 400051<br />India<br />office@spotify.com</p>
            </div>
            <div>
              <p><strong>Spotify GmbH</strong><br />Unter den Linden 10<br />10117 Berlin<br />Germany<br />office@spotify.com</p>
            </div>
            <div>
              <p><strong>Spotify Canada Inc.</strong><br />220 Adelaide Street West<br />Toronto, ON<br />office@spotify.com</p>
            </div>
            <div>
              <p><strong>Spotify Italy S.r.l.</strong><br />Via Joe Colombo 4<br />20146 Milano<br />Italy<br />office@spotify.com</p>
            </div>
          </div>
        </div>
      </aside>
      <Footer/>
    </div>
  );
}
