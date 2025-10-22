import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 1. IMPORT ALL YOUR PROVIDERS AND PAGES
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import Footer from "./components/Footer";
import ProductList from "./pages/ProductList";
import LoginPage from "./pages/LoginForm";
import SignUpPage from "./pages/SignUpPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import WishlistPage from "./pages/WishlistPage";
import Cart from "./pages/Cart";
import CheckoutPage from "./pages/CheckoutPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import ProfilePage from "./pages/ProfileForm";
import SupportPage from "./pages/SupportPage";
// --- NEW IMPORTS FOR ADMIN ---
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./components/AdminDashboard"; // Assuming AdminDashboard is in pages

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/myorders" element={<MyOrdersPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/support" element={<SupportPage />} />
            {/* --- PROTECTED ADMIN ROUTE --- */}
            {/* This new section adds the admin functionality.
                The AdminRoute component will guard the AdminDashboard. */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>
          </Routes>
          <Footer />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
