import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { Toaster } from "react-hot-toast";

// ========================================
// COMPONENTS
// ========================================

import Header from "./components/Header";
import Footer from "./components/Footer";

import ProtectedRoute from "./components/ProtectedRoute";
import SellerRoute from "./components/SellerRoute";
import AdminRoute from "./components/AdminRoute";

// ========================================
// PAGES
// ========================================

import Home from "./pages/Home";
import AddProduct from "./pages/AddProduct";
import ProductList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Seller from "./pages/Seller";
import Cart from "./pages/Cart";

// ========================================
// APP
// ========================================

function App() {

  // ======================================
  // PRODUCTS STATE
  // ======================================

  const [products, setProducts] = useState([]);


  // ======================================
  // CART STATE
  // ======================================

  const [cartItems, setCartItems] = useState(() => {

    try {

      const savedCart =
        localStorage.getItem("cartItems");

      if (!savedCart) {
        return [];
      }

      const parsedCart =
        JSON.parse(savedCart);

      if (Array.isArray(parsedCart)) {
        return parsedCart;
      }

      return [];

    } catch (error) {

      console.error(
        "Error loading cart:",
        error
      );

      return [];
    }
  });


  // ======================================
  // RETURN
  // ======================================

  return (

    <BrowserRouter>

      <div className="app">

        {/* =================================
            HEADER
        ================================== */}

        <Header />


        {/* =================================
            MAIN CONTENT
        ================================== */}

        <main className="main-content">

          <Routes>

            {/* =================================
                PUBLIC ROUTES
            ================================== */}

            <Route
              path="/"
              element={
                <Home />
              }
            />

            <Route
              path="/login"
              element={
                <Login />
              }
            />

            <Route
              path="/signup"
              element={
                <Signup />
              }
            />


            {/* =================================
                PROTECTED USER ROUTES
            ================================== */}

            {/* PRODUCTS */}

            <Route
              path="/products"
              element={

                <ProtectedRoute>

                  <ProductList
                    products={products}
                    setProducts={setProducts}
                  />

                </ProtectedRoute>

              }
            />


            {/* PRODUCT DETAILS */}

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

                  <Cart
                    cartItems={cartItems}
                    setCartItems={setCartItems}
                  />

                </ProtectedRoute>

              }
            />


            {/* =================================
                ADMIN ROUTES
            ================================== */}

            <Route
              path="/add-product"
              element={

                <AdminRoute>

                  <AddProduct
                    products={products}
                    setProducts={setProducts}
                  />

                </AdminRoute>

              }
            />


            {/* =================================
                SELLER ROUTES
            ================================== */}

            <Route
              path="/seller"
              element={

                <SellerRoute>

                  <Seller />

                </SellerRoute>

              }
            >

              {/* SELLER DASHBOARD */}

              <Route
                path="dashboard"
                element={
                  <div>
                    Seller Dashboard
                  </div>
                }
              />


              {/* SELLER PRODUCTS */}

              <Route
                path="products"
                element={

                  <ProductList
                    products={products}
                    setProducts={setProducts}
                  />

                }
              />


              {/* ADD SELLER PRODUCT */}

              <Route
                path="products/add"
                element={

                  <AddProduct
                    products={products}
                    setProducts={setProducts}
                  />

                }
              />


              {/* SELLER ORDERS */}

              <Route
                path="orders"
                element={
                  <div>
                    Orders
                  </div>
                }
              />

            </Route>


            {/* =================================
                FALLBACK
            ================================== */}

            <Route
              path="*"
              element={
                <Navigate
                  to="/"
                  replace
                />
              }
            />

          </Routes>

        </main>


        {/* =================================
            TOASTER
        ================================== */}

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
          }}
        />


        {/* =================================
            FOOTER
        ================================== */}

        <Footer />

      </div>

    </BrowserRouter>
  );
}

export default App;