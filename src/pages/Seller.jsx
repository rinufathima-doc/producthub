import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Package,
    PlusCircle,
    ShoppingBag,
    LogOut,
    Store
} from "lucide-react";

function Seller() {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <div className="seller-layout">

            {/* Sidebar */}
            <aside className="seller-sidebar">

                <div className="seller-logo">
                    <Store size={28} />
                    <span>ProductHub</span>
                </div>

                <div className="seller-info">
                    <div className="seller-avatar">
                        S
                    </div>

                    <div>
                        <h3>Seller</h3>
                        <p>Seller Account</p>
                    </div>
                </div>

                <nav className="seller-nav">

                    <Link
                        to="/seller/dashboard"
                        className={
                            isActive("/seller/dashboard")
                                ? "seller-nav-item active"
                                : "seller-nav-item"
                        }
                    >
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </Link>

                    <Link
                        to="/seller/products"
                        className={
                            isActive("/seller/products")
                                ? "seller-nav-item active"
                                : "seller-nav-item"
                        }
                    >
                        <Package size={20} />
                        <span>Products</span>
                    </Link>

                    <Link
                        to="/seller/products/add"
                        className={
                            isActive("/seller/products/add")
                                ? "seller-nav-item active"
                                : "seller-nav-item"
                        }
                    >
                        <PlusCircle size={20} />
                        <span>Add Product</span>
                    </Link>

                    <Link
                        to="/seller/orders"
                        className={
                            isActive("/seller/orders")
                                ? "seller-nav-item active"
                                : "seller-nav-item"
                        }
                    >
                        <ShoppingBag size={20} />
                        <span>Orders</span>
                    </Link>

                </nav>

                <button
                    className="seller-logout"
                    onClick={() => {
                        localStorage.removeItem("accessToken");
                        window.location.href = "/login";
                    }}
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>

            </aside>


            {/* Main Content */}
            <main className="seller-main">

                <header className="seller-header">
                    <div>
                        <h1>Seller Dashboard</h1>
                        <p>
                            Manage your products and orders
                        </p>
                    </div>
                </header>


                {/* Dashboard content */}
                {location.pathname === "/seller/dashboard" ? (

                    <div className="seller-dashboard">

                        {/* Statistics */}
                        <div className="seller-stats">

                            <div className="stat-card">
                                <div className="stat-icon">
                                    <Package size={24} />
                                </div>

                                <div>
                                    <p>Total Products</p>
                                    <h2>167</h2>
                                </div>
                            </div>


                            <div className="stat-card">
                                <div className="stat-icon">
                                    <ShoppingBag size={24} />
                                </div>

                                <div>
                                    <p>Total Orders</p>
                                    <h2>463</h2>
                                </div>
                            </div>


                            <div className="stat-card">
                                <div className="stat-icon">
                                    ₹
                                </div>

                                <div>
                                    <p>Total Sales</p>
                                    <h2>₹56789</h2>
                                </div>
                            </div>


                            <div className="stat-card">
                                <div className="stat-icon">
                                    !
                                </div>

                                <div>
                                    <p>Low Stock</p>
                                    <h2>20</h2>
                                </div>
                            </div>

                        </div>


                        {/* Recent Orders */}
                        <div className="dashboard-section">

                            <div className="section-header">
                                <h2>Recent Orders</h2>

                                <Link to="/seller/orders">
                                    View All
                                </Link>
                            </div>

                            <div className="empty-state">

                                <ShoppingBag size={48} />

                                <h3>No orders yet</h3>

                                <p>
                                    Your recent orders will appear here.
                                </p>

                            </div>

                        </div>


                        {/* Products */}
                        <div className="dashboard-section">

                            <div className="section-header">
                                <h2>Your Products</h2>

                                <Link to="/seller/products">
                                    View All
                                </Link>
                            </div>

                            <div className="empty-state">

                                <Package size={48} />

                                <h3>No products yet</h3>

                                <p>
                                    Start selling by adding your first
                                    product.
                                </p>

                                <Link
                                    to="/seller/products/add"
                                    className="add-product-button"
                                >
                                    <PlusCircle size={18} />
                                    Add Product
                                </Link>

                            </div>

                        </div>

                    </div>

                ) : (

                    <Outlet />

                )}

            </main>

        </div>
    );
}

export default Seller;