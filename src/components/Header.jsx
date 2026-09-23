
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Header = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Check if user is logged in
  const isLoggedIn = !!localStorage.getItem("accessToken");

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");

    navigate("/");
  };

  return (
    <header className="header">
      <div className="container header-container">

        <Link to="/" className="logo">
          <div className="logo-icon">P</div>
          <span>ProductHub</span>
        </Link>

        {/* Desktop navigation */}
        <nav className="nav">

          <Link to="/" className="nav-link active">
            Home
          </Link>

          {/* Show Sign Up and Login only when NOT logged in */}
          {!isLoggedIn && (
            <>
              <Link to="/signup" className="nav-link">
                Sign Up
              </Link>

              <Link to="/login" className="nav-link">
                Login
              </Link>
            </>

          )}



          <Link to="/products" className="nav-link">
            Products
          </Link>
          {isLoggedIn && (<Link to="/cart" className="nav-link">
            Cart
          </Link>
          )}


          {/* Show Logout only when logged in */}
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="nav-link logout-button"
            >
              Logout
            </button>

          )}
          
        </nav>

        {/* Hamburger button */}
        <button
          className="menu-button"
          aria-label="Open menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Mobile navigation */}
        {menuOpen && (
          <nav className="mobile-nav">

            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>

            {/* Mobile: show Sign Up + Login only when NOT logged in */}
            {!isLoggedIn && (
              <>
                <Link
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign Up
                </Link>

                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
              </>
            )}



            <Link
              to="/products"
              onClick={() => setMenuOpen(false)}
            >
              Products
            </Link>
              {isLoggedIn && (
              <Link
                to="/cart"
                onClick={() => setMenuOpen(false)}
              >
                Cart
              </Link>
            )}


            {/* Mobile: show Logout only when logged in */}
            {isLoggedIn && (
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
              >
                Logout
              </button>
            )}
          
          </nav>
        )}

      </div>
    </header>
  );
};

export default Header;

