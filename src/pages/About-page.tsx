import React from "react";
import "../styles/About-Page.css";
import Footer from "../components/Footer.tsx";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function AboutPage() {
  return (
    <div className="container py-5 mb-5">
      <div className="row mb-5">
        <div className="col-md-8 mt-3">
          <h2 className="mb-5">About Us</h2>
          <p>
            With Spotify, it’s easy to find the right music or podcast for every moment – on your phone, your computer, your tablet and more.
          </p>
          <p>
            There are millions of tracks and episodes on Spotify. So whether you’re behind the wheel, working out, partying or relaxing, the right music or podcast is always at your fingertips. Choose what you want to listen to, or let Spotify surprise you.
          </p>
          <p>
            You can also browse through the collections of friends, artists, and celebrities, or create a radio station and just sit back.
          </p>
          <p>
            Soundtrack your life with Spotify. Subscribe or listen for free.
          </p>

          <h4 className="mt-5 mb-5 ">Customer Service and Support</h4>
          <ol className="">
            <li className="text-start my-3">
              <a className="fw-bold mb-3" href="https://support.spotify.com/sa-ar/#_gl=1*13j5cl2*_gcl_au*NTUyNDg0NzY5LjE3NDg5NTQzMzk.">Help site</a>. Check out our help site for answers to your questions and to learn how to get the most out of Spotify and your music.
            </li>
            <li className="text-start my-3">
              <a className="fw-bold text-start" href="https://support.spotify.com/sa-ar/#_gl=1*13j5cl2*_gcl_au*NTUyNDg0NzY5LjE3NDg5NTQzMzk.">Community</a>. Get fast support from expert Spotify users. If there isn’t already an answer to your question, post it and someone will quickly answer.
            </li>
            <li className="text-start my-3">
              <a className="fw-bold" href="https://support.spotify.com/sa-ar/#_gl=1*13j5cl2*_gcl_au*NTUyNDg0NzY5LjE3NDg5NTQzMzk.">Contact us</a>. Contact our Customer Support if you don’t find a solution.
            </li>
            <li className="text-start my-3">
              <a className="fw-bold" href="https://x.com/spotify">@SpotifyCares</a>. Feeling sociable? Tweet the team.
            </li>
          </ol>
        </div>

        <div className="col-md-4">
          <h4>Spotify HQ</h4>
          <p>
            <strong>Spotify AB</strong><br />
            Regeringsgatan 19<br />
            SE-111 53 Stockholm<br />
            Sweden<br />
            Reg no: 556703-7485<br />
            office@spotify.com
          </p>

          <h5 className="mt-4">Spotify around the world</h5>
          <p>
            <strong>Spotify Belgium</strong><br />
            Square de Meeus 37<br />
            1000 Brussels, Belgium<br />
            office@spotify.com
          </p>
          <p>
            <strong>Spotify India LLP</strong><br />
            Bandra East, Mumbai, India<br />
            office@spotify.com
          </p>
          <p>
            <strong>Spotify GmbH</strong><br />
            Berlin, Germany<br />
            office@spotify.com
          </p>
          <p>
            <strong>Spotify Canada Inc.</strong><br />
            220 Adelaide Street West<br />
            office@spotify.com
          </p>
          <p>
            <strong>Spotify Italy S.r.l.</strong><br />
            Milan, Italy<br />
            office@spotify.com
          </p>
        </div>
      </div>
      <Footer />
    </div>

  );
}
