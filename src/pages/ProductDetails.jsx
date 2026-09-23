import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("accessToken");

  let currentUser = null;

  if (token) {
    try {
      currentUser = JSON.parse(atob(token.split(".")[1]));
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }

  const isSeller = currentUser?.role === "seller";

  //fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        const response = await api.get(`/api/products/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        console.log("Single product response:", response.data);

        setProduct(response.data.data || response.data);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);

        console.log("Backend error:", error.response?.data);

        setError("Failed to fetch product details.");

        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <h2>Loading product details...</h2>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="page">
        <div className="container">
          <h2>Product not found</h2>

          <Link to="/products">← Back to Products</Link>
        </div>
      </div>
    );
  }

  const productOwnerId =
    typeof product.createdBy === "object"
      ? product.createdBy?._id
      : product.createdBy;

  const isOwner =
    isSeller && productOwnerId?.toString() === currentUser?.user_id?.toString();

  const addToCart = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        toast.error("Please login to add products to cart");
        return;
      }

      const response = await api.post(
        "/api/products/cart",
        {
          productId: product._id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      console.log("Add to cart response:", response.data);

      toast.success("Product added to cart");

      navigate("/cart");
    } catch (error) {
      console.error("Error adding product to cart:", error);

      console.log("Backend error:", error.response?.data);

      toast.error(
        error.response?.data?.message || "Failed to add product to cart",
      );
    }
  };

  const handleEditProduct = () => {
    navigate("/seller/products/add", {
      state: {
        product,
        editMode: true,
      },
    });
  };

  return (
    <div className="page">
      <div className="container">
        <Link to="/products">← Back to Products</Link>

        <div className="product-details-page">
          <div className="product-details-image">
            <img
              src={`${import.meta.env.VITE_BACKEND_URL}/${product.image}`}
              alt={product.name}
            />
          </div>

          <div className="product-details-content">
            <span className="product-category">{product.category}</span>

            <h1>{product.name}</h1>

            <p>{product.description || "No description provided."}</p>

            <h2>₹{Number(product.price).toFixed(2)}</h2>

            <div className="product-details">
              <div>
                <span>Color</span>

                <strong>{product.colour}</strong>
              </div>

              <div>
                <span>Stock</span>

                <strong>{product.quantity}</strong>
              </div>
            </div>

            <span
              className={
                product.quantity > 0 ? "stock-badge" : "stock-badge out"
              }
            >
              {product.quantity > 0 ? "In Stock" : "Out of Stock"}
            </span>

            {isOwner ? (
              <button className="primary-button" onClick={handleEditProduct}>
                Edit Product
              </button>
            ) : (
              product.quantity > 0 && (
                <button className="primary-button" onClick={addToCart}>
                  Add to Cart
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
