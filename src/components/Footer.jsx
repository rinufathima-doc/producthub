import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">

      <div className="container footer-container">

        {/* Brand */}
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <div className="logo-icon">P</div>
            <span>ProductHub</span>
          </Link>

          <p>
            A simple and modern product management platform
            for managing your products easily.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4>Quick Links</h4>

          <div className="footer-links">
            <Link to="/">Home</Link>
            <Link to="/products">Products</Link>
            <Link to="/add-product">Add Product</Link>
            <Link to="/signup">Sign Up</Link>
            <Link to="/login">Login</Link>
          </div>
        </div>

        
        <div>
          <h4>Contact</h4>

          <div className="footer-info">
            <p>Email: support@producthub.com</p>
            <p>Phone: +91 98765 43210</p>
            <p>India</p>
          </div>
        </div>

      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} ProductHub. All rights reserved.
        </p>
      </div>

    </footer>
  );
};

export default Footer;