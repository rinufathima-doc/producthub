import { Link } from "react-router-dom";

function Home() {
  const role = localStorage.getItem("role");
  const isAdmin = role === "admin";

  console.log("ROLE:", localStorage.getItem("role"));

  return (
    <div className="home-page">

      <section className="hero">
        <div className="container hero-container">

          <div className="hero-content">
            <span className="hero-badge">
              Simple Product Management
            </span>

            <h1>
              Manage your products
              <span> effortlessly.</span>
            </h1>

            <p>
              Add, manage and organize your products from one
              simple and beautiful dashboard.
            </p>

            <div className="hero-actions">

              {isAdmin && (
                <Link
                  to="/add-product"
                  className="primary-button"
                >
                  Add Your First Product
                </Link>
              )}

              <Link
                to="/products"
                className="secondary-button"
              >
                View Products
              </Link>

            </div>
          </div>

          <div className="hero-card-wrapper">
            <div className="hero-card">

              <div className="hero-card-header">
                <div>
                  <span className="small-label">
                    PRODUCT OVERVIEW
                  </span>
                  <h3>Your Products</h3>
                </div>

                <div className="hero-card-icon">
                  📦
                </div>
              </div>

              <div className="mini-product">
                <div className="mini-product-image">
                  👟
                </div>

                <div className="mini-product-info">
                  <strong>Running Shoes</strong>
                  <span>Black • Sports</span>
                </div>

                <strong>₹89</strong>
              </div>

              <div className="mini-product">
                <div className="mini-product-image">
                  🎧
                </div>

                <div className="mini-product-info">
                  <strong>Wireless Headphones</strong>
                  <span>White • Electronics</span>
                </div>

                <strong>₹129</strong>
              </div>

              <div className="mini-product">
                <div className="mini-product-image">
                  ⌚
                </div>

                <div className="mini-product-info">
                  <strong>Smart Watch</strong>
                  <span>Silver • Accessories</span>
                </div>

                <strong>₹199</strong>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="container">

          <div className="section-heading">
            <span>FEATURES</span>

            <h2>Everything you need</h2>

            <p>
              Keep your products organized with a simple,
              intuitive interface.
            </p>
          </div>

          <div className="features-grid">

            <div className="feature-card">
              <div className="feature-icon">➕</div>

              <h3>Add Products</h3>

              <p>
                Quickly add new products with all the
                important product information.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📦</div>

              <h3>Manage Products</h3>

              <p>
                View and manage all your products in
                one convenient location.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💾</div>

              <h3>Persistent Storage</h3>

              <p>
                Your products are stored locally and
                remain available after refreshing.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">

        <div className="container cta-container">

          <div>
            <h2>
              {isAdmin
                ? "Ready to add a product?"
                : "Ready to view products?"}
            </h2>

            <p>
              {isAdmin
                ? "Start building your product collection today."
                : "Browse your product collection today."}
            </p>
          </div>

          {isAdmin ? (
            <Link
              to="/add-product"
              className="cta-button"
            >
              Add Product →
            </Link>
          ) : (
            <Link
              to="/products"
              className="cta-button"
            >
              View Products →
            </Link>
          )}

        </div>

      </section>

    </div>
  );
}

export default Home;

