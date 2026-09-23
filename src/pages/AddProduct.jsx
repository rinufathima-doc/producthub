import { useState } from "react";
import { useLocation, useNavigate, } from "react-router-dom";
import api from "../api";
import toast from "react-hot-toast";

function AddProduct({ products, setProducts }) {
  const navigate = useNavigate();
  const location = useLocation();


  const productToEdit = location.state?.product;


  const [formData, setFormData] = useState({
    name: productToEdit?.name || "",
    colour: productToEdit?.colour || "",
    price: productToEdit?.price || "",
    category: productToEdit?.category || "",
    quantity: productToEdit?.quantity || "",
    description: productToEdit?.description || "",
    image: null, // For image upload
  })


  const [errors, setErrors] = useState({});
  const [showValidation, setShowValidation] = useState(false);


  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));


    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };


  const handleSubmit = (event) => {
    event.preventDefault();

    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required.";
    }

    if (!formData.category) {
      newErrors.category = "Category is required.";
    }

    if (!formData.colour.trim()) {
      newErrors.colour = "Colour is required.";
    }

    if (!formData.price) {
      newErrors.price = "Price is required.";
    } else if (Number(formData.price) <= 0) {
      newErrors.price = "Price must be greater than 0.";
    }

    if (formData.quantity === "") {
      newErrors.quantity = "Quantity is required.";
    } else if (Number(formData.quantity) < 0) {
      newErrors.quantity = "Quantity cannot be negative.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Product description is required.";
    }

    // Image is required only when creating a product
    if (!formData.image && !productToEdit) {
      newErrors.image = "Product image is required.";
    }

    setErrors(newErrors);

    // Show validation box if there are errors
    if (Object.keys(newErrors).length > 0) {
      setShowValidation(true);
      return;
    }

    setShowValidation(false);

    // Your existing FormData code continues here
    const data = new FormData();

    data.append("name", formData.name);
    data.append("colour", formData.colour);
    data.append("category", formData.category);
    data.append("price", Number(formData.price));
    data.append("quantity", Number(formData.quantity));
    data.append("description", formData.description);

    if (formData.image) {
      data.append("image", formData.image);
    }

    const token = localStorage.getItem("accessToken");



    const request = productToEdit
      ? api.put(`/api/products/${productToEdit._id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      : api.post("/api/products", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });


    request
      .then((response) => {
        console.log(
          productToEdit
            ? "Product updated successfully:"
            : "Product added successfully:",
          response.data
        );

        // ✅ Show success toast
        if (productToEdit) {
          toast.success("Product updated successfully!");
        } else {
          toast.success("Product added successfully!");
        }

        navigate("/products");
      })
      .catch((error) => {
        console.error(
          productToEdit
            ? "Error updating product:"
            : "Error adding product:",
          error
        );

        console.log("Backend error:", error.response?.data);

        // ❌ Show error toast
        toast.error(
          error.response?.data?.message ||
          (productToEdit
            ? "Failed to update product."
            : "Failed to add product.")
        );
      });
    }



    return (
      <div className="page">
        <div className="container">



          <div className="page-header">

            <div>

              <span className="page-eyebrow">
                PRODUCT MANAGEMENT
              </span>

              <h1>
                {productToEdit
                  ? "Edit Product"
                  : "Add New Product"}
              </h1>

              <p>
                {productToEdit
                  ? "Update the details of your product."
                  : "Enter the details below to add a new product."}
              </p>

            </div>

          </div>



          <div className="form-wrapper">
            {showValidation && Object.keys(errors).length > 0 && (
              <div className="validation-box">
                <h3>⚠ Please fill in the required fields</h3>

                <ul>
                  {Object.values(errors).map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <form
              className="product-form"
              onSubmit={handleSubmit}
            >



              <div className="form-section">

                <div className="form-section-title">

                  <span className="form-number">
                    01
                  </span>

                  <div>

                    <h2>
                      Basic Information
                    </h2>

                    <p>
                      Tell us about your product.
                    </p>

                  </div>

                </div>

                <div className="form-grid">



                  <div className="form-group full-width">
                    <label htmlFor="name">
                      Product Name <span>*</span>
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="e.g. Premium Wireless Headphones"
                      value={formData.name}
                      onChange={handleChange}
                    />

                    {errors.name && (
                      <p className="field-error">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="image">
                      Product Image <span>*</span>
                    </label>

                    <input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        setFormData((previous) => ({
                          ...previous,
                          image: event.target.files[0],
                        }));
                      }}
                    />
                  </div>


                  <div className="form-group">

                    <label htmlFor="category">
                      Category <span>*</span>
                    </label>

                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                    >

                      <option value="">
                        Select category
                      </option>

                      <option value="Electronics">
                        Electronics
                      </option>

                      <option value="Clothing">
                        Clothing
                      </option>

                      <option value="plants">
                        Plants
                      </option>

                      <option value="Accessories">
                        Accessories
                      </option>

                      <option value="Home">
                        Home
                      </option>

                      <option value="Other">
                        Other
                      </option>

                    </select>

                    {errors.category && (
                      <p className="field-error">
                        {errors.category}
                      </p>
                    )}

                  </div>



                  <div className="form-group">

                    <label htmlFor="colour">
                      Colour <span>*</span>
                    </label>

                    <input
                      id="colour"
                      name="colour"
                      type="text"
                      placeholder="e.g. Black"
                      value={formData.colour}
                      onChange={handleChange}
                    />

                    {errors.colour && (
                      <p className="field-error">
                        {errors.colour}
                      </p>
                    )}

                  </div>

                </div>

              </div>

              <div className="form-divider"></div>

              {/* =========================
                  PRICING AND INVENTORY
              ========================= */}

              <div className="form-section">

                <div className="form-section-title">

                  <span className="form-number">
                    02
                  </span>

                  <div>

                    <h2>
                      Pricing & Inventory
                    </h2>

                    <p>
                      Set your product price and quantity.
                    </p>

                  </div>

                </div>

                <div className="form-grid">

                  {/* PRICE */}

                  <div className="form-group">

                    <label htmlFor="price">
                      Price <span>*</span>
                    </label>

                    <div className="input-with-symbol">

                      <input
                        id="price"
                        name="price"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.price}
                        onChange={handleChange}
                      />

                    </div>

                    {errors.price && (
                      <p className="field-error">
                        {errors.price}
                      </p>
                    )}

                  </div>

                  {/* QUANTITY */}

                  <div className="form-group">

                    <label htmlFor="quantity">
                      Quantity <span>*</span>
                    </label>

                    <input
                      id="quantity"
                      name="quantity"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={formData.quantity}
                      onChange={handleChange}
                    />

                    {errors.quantity && (
                      <p className="field-error">
                        {errors.quantity}
                      </p>
                    )}

                  </div>

                </div>

              </div>

              <div className="form-divider"></div>



              <div className="form-section">

                <div className="form-section-title">

                  <span className="form-number">
                    03
                  </span>

                  <div>

                    <h2>
                      Description
                    </h2>

                    <p>
                      Add some additional information.
                    </p>

                  </div>

                </div>

                <div className="form-group">

                  <label htmlFor="description">
                    Product Description
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    rows="5"
                    placeholder="Describe your product..."
                    value={formData.description}
                    onChange={handleChange}
                  ></textarea>

                  {errors.description && (
                    <p className="field-error">
                      {errors.description}
                    </p>
                  )}

                </div>

              </div>

              {/* =========================
                  BUTTONS
              ========================= */}

              <div className="form-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => navigate("/products")}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="submit-button"
                >

                  {productToEdit
                    ? "Save Changes"
                    : "Add Product"}

                  <span>
                    →
                  </span>

                </button>

              </div>

            </form>

          </div>

        </div>
      </div>
    );
  }

  export default AddProduct;