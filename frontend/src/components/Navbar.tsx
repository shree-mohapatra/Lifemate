import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="navb">

          {/* Logo */}
          <div className="logo-section">
            <Link to="/" className="flex items-center gap-2 no-underline">
              <img
                src="/LifeMateLogo.jpeg"
                alt="Logo"
                className="logoimg"
              />
              <span className="navbar-logo">Lifemate</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="desktop-menu">
            <a href="#about" className="navbar-link">About</a>
            <a href="#features" className="navbar-link">Features</a>
            <a href="#how-it-works" className="navbar-link">How it Works</a>
          </div>

          {/* CTA + Hamburger */}
          <div className="right-section">

            {/* Mobile Menu Button */}
            <button
              className="menu-btn"
              onClick={() => setIsOpen(!isOpen)}
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="mobile-menu">
            <a href="#about" className="navbar-link">About</a>
            <a href="#features" className="navbar-link">Features</a>
            <a href="#how-it-works" className="navbar-link">How it Works</a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
