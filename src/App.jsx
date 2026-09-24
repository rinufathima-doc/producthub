import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { Toaster } from "react-hot-toast";

import Header from "./components/Header";
import Footer from "./components/Footer";

import ProtectedRoute from "./components/ProtectedRoute";
import SellerRoute from "./components/SellerRoute";
import AdminRoute from "./components/AdminRoute";

import Home from "./pages/Home";
import AddProduct from "./pages/AddProduct";
import ProductList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Seller  from "./pages/Seller.jsx";

function App() {
  const [products, setProducts] = useState([]);

  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cartItems");

      if (!savedCart) {
        return [];
      }

      const parsedCart = JSON.parse(savedCart);

      if (Array.isArray(parsedCart)) {
        return parsedCart;
      }

      return [];
    } catch (error) {
      console.error("Error loading cart:", error);

      return [];
    }
  });

  return (
    <BrowserRouter>
      <div className="app">
        {}

        <Header />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/login" element={<Login />} />

            <Route path="/signup" element={<Signup />} />

            {/* PRODUCTS */}

            <Route
              path="/products"
              element={
                <ProtectedRoute>
                  <ProductList products={products} setProducts={setProducts} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/product/:id"
              element={
                <ProtectedRoute>
                  <ProductDetails />
                </ProtectedRoute>
              }
            />

            {/* CART */}

            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart cartItems={cartItems} setCartItems={setCartItems} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/add-product"
              element={
                <AdminRoute>
                  <AddProduct products={products} setProducts={setProducts} />
                </AdminRoute>
              }
            />

            <Route
              path="/seller"
              element={
                <SellerRoute>
                  <Seller />
                </SellerRoute>
              }
            >
              <Route path="dashboard" element={<div>Seller Dashboard</div>} />

              <Route
                path="products"
                element={
                  <ProductList products={products} setProducts={setProducts} />
                }
              />

              <Route
                path="products/add"
                element={
                  <AddProduct products={products} setProducts={setProducts} />
                }
              />

              <Route path="orders" element={<div>Orders</div>} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
          }}
        />

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
