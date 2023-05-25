import React, { useRef, useState } from "react";
import { FaBars, FaTimes, FaHome, FaInfoCircle, FaEnvelope } from "react-icons/fa";
import "../styles/Header.css";

function Header() {
  const navRef = useRef();
  const [showNav, setShowNav] = useState(false);

  const showNavbar = () => {
    setShowNav(!showNav);
  };

  return (
    <header>
      <nav ref={navRef} className={showNav ? "responsive_nav" : ""}>
        <a className="logo" href="/">
          <h3>Food-Points</h3>
        </a>
        <div className="menu">
          <a href="/">
            <FaHome className="icon" />
            Accueil
          </a>
          <a href="/apropos">
            <FaInfoCircle className="icon" />
            A propos
          </a>
          <a href="/contact">
            <FaEnvelope className="icon" />
            Contact
          </a>
        </div>
        <button className="nav-btn nav-close-btn" onClick={showNavbar}>
          <FaTimes />
        </button>
      </nav>
      <button className="nav-btn" onClick={showNavbar}>
        <FaBars />
      </button>
    </header>
  );
}

export default Header;
