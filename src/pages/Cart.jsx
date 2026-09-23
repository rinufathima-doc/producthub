import { Link } from "react-router-dom";
import {
    Trash2,
    Plus,
    Minus,
    ShoppingCart,
} from "lucide-react";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import api from "../api";

function Cart({ cartItems, setCartItems }) {

    const [loading, setLoading] = useState(true);

    // ========================================
    // GET CART FROM BACKEND
    // ========================================

    useEffect(() => {

        const fetchCart = async () => {

            try {

                const accessToken =
                    localStorage.getItem("accessToken");

                if (!accessToken) {
                    setCartItems([]);
                    setLoading(false);
                    return;
                }

                const response = await api.get(
                    "/api/products/cart",
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                console.log(
                    "Cart response:",
                    response.data
                );

                setCartItems(
                    response.data.data || []
                );

            } catch (error) {

                console.error(
                    "Error fetching cart:",
                    error
                );

                console.log(
                    "Backend error:",
                    error.response?.data
                );

                toast.error(
                    error.response?.data?.message ||
                    "Failed to load cart"
                );

                setCartItems([]);

            } finally {

                setLoading(false);

            }

        };

        fetchCart();

    }, [setCartItems]);


    // ========================================
    // LOADING
    // ========================================

    if (loading) {

        return (
            <div className="cart-page">

                <div className="container">

                    <h2>
                        Loading cart...
                    </h2>

                </div>

            </div>
        );

    }


    // ========================================
    // MAKE SURE CART IS ARRAY
    // ========================================

    const items =
        Array.isArray(cartItems)
            ? cartItems
            : [];


    // ========================================
    // REMOVE PRODUCT
    // ========================================

    const removeFromCart = async (productId) => {

        try {

            const accessToken =
                localStorage.getItem("accessToken");

            const response = await api.delete(
                `/api/products/cart/${productId}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${accessToken}`,
                    },
                }
            );

            setCartItems(
                response.data.data || []
            );

            toast.success(
                "Product removed from cart"
            );

        } catch (error) {

            console.error(
                "Remove cart error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to remove product"
            );

        }

    };


    // ========================================
    // INCREASE QUANTITY
    // ========================================

    const increaseQuantity = async (productId, currentQuantity) => {

        try {

            const accessToken =
                localStorage.getItem("accessToken");

            const response = await api.patch(
                `/api/products/cart/${productId}`,
                {
                    quantity:
                        Number(currentQuantity) + 1,
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${accessToken}`,
                    },
                }
            );

            setCartItems(
                response.data.data || []
            );

        } catch (error) {

            console.error(
                "Increase quantity error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to increase quantity"
            );

        }

    };


    // ========================================
    // DECREASE QUANTITY
    // ========================================

    const decreaseQuantity = async (productId, currentQuantity) => {

        // If quantity is 1, remove product
        if (Number(currentQuantity) <= 1) {

            await removeFromCart(productId);

            return;

        }


        try {

            const accessToken =
                localStorage.getItem("accessToken");

            const response = await api.patch(
                `/api/products/cart/${productId}`,
                {
                    quantity:
                        Number(currentQuantity) - 1,
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${accessToken}`,
                    },
                }
            );

            setCartItems(
                response.data.data || []
            );

        } catch (error) {

            console.error(
                "Decrease quantity error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to decrease quantity"
            );

        }

    };


    // ========================================
    // CLEAR CART
    // ========================================

    const clearCart = async () => {

        try {

            const accessToken =
                localStorage.getItem("accessToken");

            await api.delete(
                "/api/products/cart",
                {
                    headers: {
                        Authorization:
                            `Bearer ${accessToken}`,
                    },
                }
            );

            setCartItems([]);

            toast.success(
                "Cart cleared"
            );

        } catch (error) {

            console.error(
                "Clear cart error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to clear cart"
            );

        }

    };


    // ========================================
    // TOTAL
    // ========================================

    const total = items.reduce(
        (sum, item) => {

            const product =
                item.product;

            const quantity =
                Number(item.quantity || 1);

            const price =
                Number(product?.price || 0);

            return sum + price * quantity;

        },
        0
    );


    // ========================================
    // EMPTY CART
    // ========================================

    if (items.length === 0) {

        return (
            <div className="cart-page">

                <div className="container">

                    <div className="empty-cart">

                        <ShoppingCart size={70} />

                        <h1>
                            Your Cart is Empty
                        </h1>

                        <p>
                            You haven't added any products
                            to your cart yet.
                        </p>

                        <Link
                            to="/products"
                            className="primary-button"
                        >
                            Continue Shopping
                        </Link>

                    </div>

                </div>

            </div>
        );

    }


    // ========================================
    // CART PAGE
    // ========================================

    return (
        <div className="cart-page">

            <div className="container">

                {/* CART HEADER */}

                <div className="cart-header">

                    <div>

                        <h1>
                            Shopping Cart
                        </h1>

                        <p>
                            {items.length}{" "}
                            {items.length === 1
                                ? "item"
                                : "items"}{" "}
                            in your cart
                        </p>

                    </div>

                    <button
                        className="clear-cart-button"
                        onClick={clearCart}
                    >
                        Clear Cart
                    </button>

                </div>


                {/* CART LAYOUT */}

                <div className="cart-layout">


                    {/* CART PRODUCTS */}

                    <div className="cart-items">

                        {items.map((item) => {

                            const product =
                                item.product;

                            // Safety check
                            if (!product) {
                                return null;
                            }

                            const quantity =
                                Number(
                                    item.quantity || 1
                                );

                            return (

                                <div
                                    className="cart-item"
                                    key={product._id}
                                >

                                    {/* PRODUCT IMAGE */}

                                    <div className="cart-item-image">

                                        <img
                                            src={`${import.meta.env.VITE_BACKEND_URL}/${product.image}`}
                                            alt={product.name}
                                        />

                                    </div>


                                    {/* PRODUCT INFORMATION */}

                                    <div className="cart-item-info">

                                        <span className="cart-category">
                                            {product.category}
                                        </span>

                                        <h2>
                                            {product.name}
                                        </h2>

                                        <p>
                                            {product.description}
                                        </p>

                                        <span className="cart-price">
                                            ₹
                                            {Number(
                                                product.price || 0
                                            ).toFixed(2)}
                                        </span>

                                    </div>


                                    {/* QUANTITY */}

                                    <div className="cart-quantity">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                decreaseQuantity(
                                                    product._id,
                                                    quantity
                                                )
                                            }
                                        >
                                            <Minus size={16} />
                                        </button>

                                        <span>
                                            {quantity}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                increaseQuantity(
                                                    product._id,
                                                    quantity
                                                )
                                            }
                                        >
                                            <Plus size={16} />
                                        </button>

                                    </div>


                                    {/* ITEM TOTAL */}

                                    <div className="cart-item-total">

                                        <strong>
                                            ₹
                                            {(
                                                Number(
                                                    product.price || 0
                                                ) *
                                                quantity
                                            ).toFixed(2)}
                                        </strong>

                                    </div>


                                    {/* REMOVE */}

                                    <button
                                        type="button"
                                        className="remove-cart-item"
                                        onClick={() =>
                                            removeFromCart(
                                                product._id
                                            )
                                        }
                                    >
                                        <Trash2 size={20} />
                                    </button>

                                </div>

                            );

                        })}

                    </div>


                    {/* ORDER SUMMARY */}

                    <div className="cart-summary">

                        <h2>
                            Order Summary
                        </h2>


                        <div className="summary-row">

                            <span>
                                Subtotal
                            </span>

                            <strong>
                                ₹{total.toFixed(2)}
                            </strong>

                        </div>


                        <div className="summary-row">

                            <span>
                                Shipping
                            </span>

                            <strong>
                                Free
                            </strong>

                        </div>


                        <div className="summary-divider"></div>


                        <div className="summary-total">

                            <span>
                                Total
                            </span>

                            <strong>
                                ₹{total.toFixed(2)}
                            </strong>

                        </div>


                        <button
                            className="checkout-button"
                            onClick={() =>
                                toast.success(
                                    "Checkout coming soon!"
                                )
                            }
                        >
                            Proceed to Checkout
                        </button>


                        <Link
                            to="/products"
                            className="continue-shopping"
                        >
                            ← Continue Shopping
                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );

}

export default Cart;

