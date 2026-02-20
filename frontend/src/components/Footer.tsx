import '../styles/footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Top Section */}
        <div className="footer-top">

          {/* Brand */}
          <div className="footer-brand">
            <h3>Lifemate</h3>
            <p>
              Your personal health companion — personalized diet, habits, and future insights in one place.
            </p>
          </div>

          {/* Product */}
          <div className="footer-column">
            <h4>Product</h4>
            <ul>
              <li><a href="#">Features</a></li>
              <li><a href="#">How it Works</a></li>
              <li><a href="#">Pricing</a></li>
              <li><a href="#">FAQ</a></li>
            </ul>
          </div>

          {/* Company */}
          <div className="footer-column">
            <h4>Company</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="footer-column">
            <h4>Legal</h4>
            <ul>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom">
           <p>Lifemate – Your daily health companion</p>
        <p>© {new Date().getFullYear()} Lifemate. All rights reserved.</p>

          <div className="footer-social">
            <a href="#" aria-label="Twitter">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231z"/>
              </svg>
            </a>

            <a href="#" aria-label="Instagram">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919..." />
              </svg>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
