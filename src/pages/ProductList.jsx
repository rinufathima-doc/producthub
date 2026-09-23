import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../api";
import toast from "react-hot-toast";

function ProductList() {
  const location = useLocation();

  const isSellerProducts =
    location.pathname === "/seller/products";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [deleteId, setDeleteId] = useState(null);
  const [showClearConfirmation, setShowClearConfirmation] =
    useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("accessToken");

      if (!token) {
        toast.error("Please login first");
        return;
      }

      const endpoint = isSellerProducts
        ? "/api/products/my-products"
        : "/api/products";

      const response = await api.get(
        `${endpoint}?page=${page}&limit=3&search=${encodeURIComponent(
          search
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("GET products response:", response.data);

      const productData = response.data?.data;

      if (Array.isArray(productData)) {
        setProducts(productData);
      } else {
        setProducts([]);
      }

      setTotalPages(
        response.data?.pagination?.totalPages || 1
      );
    } catch (error) {
      console.error(
        "Error fetching products:",
        error
      );

      console.log(
        "Backend error:",
        error.response?.data
      );

      setProducts([]);

      toast.error(
        error.response?.data?.message ||
          "Failed to fetch products"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, search, isSellerProducts]);

  const handleDelete = async (id) => {
    try {
      const token =
        localStorage.getItem("accessToken");

      await api.delete(
        `/api/products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        "Product deleted successfully"
      );

      setProducts((previousProducts) =>
        previousProducts.filter(
          (product) => product._id !== id
        )
      );

      setDeleteId(null);
    } catch (error) {
      console.error(
        "Error deleting product:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to delete product"
      );

      setDeleteId(null);
    }
  };

  const handleClearAll = () => {
    setShowClearConfirmation(true);
  };

  const confirmClearAll = async () => {
    try {
      const token =
        localStorage.getItem("accessToken");

      await api.delete(
        "/api/products",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        "All products deleted successfully"
      );

      setProducts([]);
      setShowClearConfirmation(false);
      setPage(1);
    } catch (error) {
      console.error(
        "Error deleting all products:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to delete products"
      );

      setShowClearConfirmation(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <div className="empty-state">
            <div className="empty-icon">
              📦
            </div>

            <h2>
              Loading products...
            </h2>

            <p>
              Please wait while we load the products.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">

      {deleteId && (
        <div className="confirmation-overlay">
          <div className="confirmation-box">

            <div className="confirmation-icon">
              🗑️
            </div>

            <h2>
              Delete Product?
            </h2>

            <p>
              Are you sure you want to delete
              this product?
              <br />
              This action cannot be undone.
            </p>

            <div className="confirmation-actions">

              <button
                className="cancel-delete-button"
                onClick={() =>
                  setDeleteId(null)
                }
              >
                Cancel
              </button>

              <button
                className="confirm-delete-button"
                onClick={() =>
                  handleDelete(deleteId)
                }
              >
                Delete
              </button>

            </div>
          </div>
        </div>
      )}

      {showClearConfirmation && (
        <div className="confirmation-overlay">
          <div className="confirmation-box">

            <div className="confirmation-icon">
              ⚠️
            </div>

            <h2>
              Clear All Products?
            </h2>

            <p>
              Are you sure you want to delete
              all products?
              <br />
              This action cannot be undone.
            </p>

            <div className="confirmation-actions">

              <button
                className="cancel-delete-button"
                onClick={() =>
                  setShowClearConfirmation(false)
                }
              >
                Cancel
              </button>

              <button
                className="confirm-delete-button"
                onClick={confirmClearAll}
              >
                Clear All
              </button>

            </div>
          </div>
        </div>
      )}

      <div className="container">

        <div className="products-header">

          <div>
            <span className="page-eyebrow">
              PRODUCT MANAGEMENT
            </span>

            <h1>
              Products
            </h1>

            <p>
              Manage and view all your products.
            </p>
          </div>

          {isSellerProducts && (
            <div className="products-actions">

              <button
                className="primary-button"
                onClick={handleClearAll}
              >
                Clear All
              </button>

              <Link
                to="/seller/products/add"
                className="primary-button"
              >
                + Add Product
              </Link>

            </div>
          )}

        </div>

        <div className="products-toolbar">

          <div className="product-count">

            <strong>
              {products.length}
            </strong>

            <span>
              {products.length === 1
                ? " Product"
                : " Products"}
            </span>

          </div>

          <div className="search-box">

            <span>
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
            />

          </div>

        </div>

        {products.length === 0 && search ? (

          <div className="empty-state">

            <div className="empty-icon">
              🔍
            </div>

            <h2>
              No products found
            </h2>

            <p>
              Try searching with a
              different keyword.
            </p>

          </div>

        ) : products.length === 0 ? (

          <div className="empty-state">

            <div className="empty-icon">
              📦
            </div>

            <h2>
              {isSellerProducts
                ? "You haven't added any products yet"
                : "No products yet"}
            </h2>

            <p>
              {isSellerProducts
                ? "Start selling by adding your first product."
                : "There are no products available yet."}
            </p>

            {isSellerProducts && (
              <Link
                to="/seller/products/add"
                className="primary-button"
              >
                Add Your First Product
              </Link>
            )}

          </div>

        ) : (

          <div className="products-grid">

            {products.map((product) => (

              <Link
                to={`/product/${product._id}`}
                className="product-card"
                key={product._id}
              >

                <div className="product-card-top">

                  <div className="product-placeholder">

                    <img
                      src={`${import.meta.env.VITE_BACKEND_URL}/${product.image}`}
                      alt={product.name}
                    />

                  </div>

                  {isSellerProducts && (
                    <button
                      className="delete-button"
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        setDeleteId(product._id);
                      }}
                      aria-label="Delete product"
                    >
                      Delete
                    </button>
                  )}

                </div>

                <div className="product-card-content">

                  <span className="product-category">
                    {product.category}
                  </span>

                  <h3>
                    {product.name}
                  </h3>

                  <p className="product-description">
                    {product.description ||
                      "No description provided."}
                  </p>

                  <div className="product-details">

                    <div>
                      <span>
                        Colour
                      </span>

                      <strong>
                        {product.colour}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Stock
                      </span>

                      <strong>
                        {product.quantity}
                      </strong>
                    </div>

                  </div>

                  <div className="product-card-footer">

                    <strong className="product-price">
                      ₹
                      {Number(
                        product.price || 0
                      ).toFixed(2)}
                    </strong>

                    <span
                      className={
                        Number(product.quantity) > 0
                          ? "stock-badge"
                          : "stock-badge out"
                      }
                    >
                      {Number(product.quantity) > 0
                        ? "In Stock"
                        : "Out of Stock"}
                    </span>

                  </div>

                </div>

              </Link>

            ))}

          </div>

        )}

        <div className="pagination">

          <button
            onClick={() =>
              setPage((previousPage) =>
                Math.max(
                  previousPage - 1,
                  1
                )
              )
            }
            disabled={page === 1}
          >
            ← Previous
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() =>
              setPage((previousPage) =>
                Math.min(
                  previousPage + 1,
                  totalPages
                )
              )
            }
            disabled={
              page === totalPages
            }
          >
            Next →
          </button>

        </div>

      </div>
    </div>
  );
}

export default ProductList;