import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  return (
    <nav className="h-16 flex items-center navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6  lg:px-8">
        <div className="navb">

          {/* Logo */}
          <div className="flex-shrink-0 h-16 flex items-center">
  <Link
    to="/"
    className="flex items-center gap-2 no-underline h-full"
  >
    <img
      src="/LifeMateLogo.jpeg"
      alt="Logo"
      className="logoimg"
    />
    <span className="navbar-logo flex items-center">
      Lifemate
    </span>
  </Link>
</div>


          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-10 ">
            <a href="#about" className="navbar-link ">About</a>
            <a href="#features" className="navbar-link ">Features</a>
            
            <a href="#how-it-works" className="navbar-link">How it Works</a>
            
           
          </div>

             <Link to="/signin"
    className="flex items-center gap-2 no-underline h-full">
              <button className="navbar-btn">
               Get Started
               </button>
            </Link>

         

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
