import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom"; // Added Link for buttons
import { useCart } from "../context/CartContext";
import "../style/HomePage.css"; // The CSS file remains the same, but you'll need to add styles for the new classes

// --- NEW AND UPDATED HELPER DATA ---

// NEW: Enhanced slider data with titles, slogans, and images
const sliderData = [
  {
    bgImage: "https://domf5oio6qrcr.cloudfront.net/medialibrary/11499/3b360279-8b43-40f3-9b11-604749128187.jpg",
    title: "Fresh Vegetables at 50% OFF",
    slogan: "Quality you can taste, prices you'll love.",
  },
  {
    bgImage: "https://centerforfamilymedicine.com/wp-content/uploads/2020/06/Center-for-family-medicine-The-Health-Benefits-of-Eating-10-Servings-Of-Fruits-_-Veggies-Per-Day.jpg",
    title: "Instant Delivery on All Orders",
    slogan: "From our store to your door in minutes.",
  },
  {
    bgImage: "https://media.istockphoto.com/id/1449032425/photo/shopping-bag-full-of-healthy-food-on-blue.jpg?s=612x612&w=0&k=20&c=856XpqRgq8Bj9Mr28VzAdW-iTyHEj_dW01m6SPPHsOU=",
    title: "Save Big on Monthly Groceries",
    slogan: "Plan your month, save your money.",
  },
];

const categories = [
  { name: "Fruits & Veggies", icon: "🍎" },
  { name: "Dairy & Bread", icon: "🍞" },
  { name: "Snacks & Munchies", icon: "🍿" },
  { name: "Cold Drinks & Juices", icon: "🥤" },
  { name: "Breakfast & Cereal", icon: "🥣" },
  { name: "Cleaning Essentials", icon: "🧼" },
];

const featuredProducts = [
  {
    id: 1,
    name: "Fresh Banana",
    image: "https://nutritionsource.hsph.harvard.edu/wp-content/uploads/2018/08/bananas-1354785_1920.jpg",
    price: 50,
    quantity: "1 dozen",
  },
  {
    id: 2,
    name: "Milk",
    image: "https://nutritionsource.hsph.harvard.edu/wp-content/uploads/2024/11/AdobeStock_354060824-1024x683.jpeg",
    price: 32,
    quantity: "500 ml pouch",
  },
  {
    id: 3,
    name: "Chips",
    image: "https://upload.wikimedia.org/wikipedia/commons/6/69/Potato-Chips.jpg",
    price: 20,
    quantity: "52 g",
  },
  {
    id: 4,
    name: "Brown Bread",
    image: "https://upload.wikimedia.org/wikipedia/commons/8/8b/Kommissbrot.jpg",
    price: 45,
    quantity: "400 g",
  },
  {
        id: "5",
        name: "Apples (Royal Gala)",
        price: 150,
        image: "/pictures/fruits/apple.jpg",
      },
      {
        id: "6",
        name: "Bananas",
        price: 60,
        image: "/pictures/fruits/banana.jpg",
      },
      {
        id: "7",
        name: "Pomegranate",
        price: 120,
        image: "/pictures/fruits/pomrgranate.jpg",
      },

];

// NEW: Data for the Discounts section
const discounts = [
  {
    icon: "💳",
    title: "Bank Offers",
    description: "Up to 20% instant discount on HDFC, ICICI, and SBI cards.",
  },
  {
    icon: "🎉",
    title: "New User Special",
    description: "Get flat ₹100 off on your first order above ₹599.",
  },
  {
    icon: "📦",
    title: "Bulk Savings",
    description: "Save more on monthly essentials when you buy in bulk.",
  },
];

// NEW: Data for the "Why Choose Us" section
const valueProps = [
  {
    icon: "⚡️",
    title: "Lightning Fast Delivery",
    description: "Get your order delivered in as little as 10 minutes.",
  },
  {
    icon: "💯",
    title: "Best Quality Guaranteed",
    description: "Handpicked and fresh products delivered to you every time.",
  },
  {
    icon: "💸",
    title: "Unbeatable Prices",
    description:
      "Enjoy great discounts and offers on a wide range of products.",
  },
];

const HomePage = () => {
  const { addToCart } = useCart();
  const [currentSlide, setCurrentSlide] = useState(0);
  const location = useLocation();
  const [loginMessage, setLoginMessage] = useState(null);

  const messageStyles = {
    padding: "1rem",
    margin: "1rem auto",
    width: "95%",
    maxWidth: "1200px",
    backgroundColor: "#C6F6D5",
    color: "#22543D",
    textAlign: "center",
    fontWeight: "bold",
    borderRadius: "8px",
    border: "1px solid #38A169",
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 5000); // Increased time to 5s for better readability
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (location.state?.message) {
      setLoginMessage(location.state.message);
      const timer = setTimeout(() => setLoginMessage(null), 5000);
      window.history.replaceState({}, document.title);
      return () => clearTimeout(timer);
    }
  }, [location]);

  return (
    <div className="page-container">
      {loginMessage && <div style={messageStyles}>{loginMessage}</div>}

      <main>
        {/* --- MODIFIED: Image Slider Section --- */}
        <section className="slider-container">
          <div
            className="slider-track"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {sliderData.map((slide, index) => (
              <div
                key={index}
                className="slide"
                style={{ backgroundImage: `url(${slide.bgImage})` }}
              >
                <div className="slide-content">
                  <h1 className="slide-title">{slide.title}</h1>
                  <p className="slide-slogan">{slide.slogan}</p>
                  <Link to="/products" className="shop-now-btn">
                    Shop Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="dots-container">
            {sliderData.map((_, index) => (
              <span
                key={index}
                className={index === currentSlide ? "dot active" : "dot"}
                onClick={() => setCurrentSlide(index)}
              ></span>
            ))}
          </div>
        </section>

        {/* --- Categories Section (Unchanged) --- */}
        <section className="section">
          <h3 className="section-title">Shop by Category</h3>
          <div className="grid">
            {categories.map((category, index) => (
              <div key={index} className="category-card">
                <span className="category-icon">{category.icon}</span>
                <p>{category.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* --- Featured Products Section (Unchanged) --- */}
        <section className="section">
          <h3 className="section-title">Featured Products</h3>
          <div className="grid">
            {featuredProducts.map((product) => (
              <div key={product.id} className="product-card">
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />
                <h4 className="product-name">{product.name}</h4>
                <p className="product-quantity">{product.quantity}</p>
                <div className="product-footer">
                  <span className="product-price">₹{product.price}</span>
                  <button
                    className="add-button"
                    onClick={() => addToCart(product)}
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- NEW: Discounts Section --- */}
        <section className="section section-teal-bg">
          <h3 className="section-title">Discounts & Offers</h3>
          <div className="grid">
            {discounts.map((discount, index) => (
              <div key={index} className="discount-card">
                <div className="discount-icon">{discount.icon}</div>
                <h4>{discount.title}</h4>
                <p>{discount.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* --- NEW: About Us Section --- */}
        <section className="section">
          <div className="about-section">
            <div className="about-text">
              <h3 className="section-title">About ZYAGRA</h3>
              <p>
                Welcome to ZYAGRA, your new favorite online grocery store! Born
                in the heart of Ghaziabad, we are on a mission to revolutionize
                your grocery shopping experience. We believe in providing the
                freshest produce, the widest variety of daily essentials, and
                lightning-fast delivery, all at the click of a button.
              </p>
              <p>
                Our promise is simple: quality, speed, and unbeatable value.
              </p>
            </div>
            <div className="about-image-container">
              <img
                src="/pictures/home page/promise.jpg"
                alt="About ZYAGRA"
                className="about-image"
              />
            </div>
          </div>
        </section>

        {/* --- NEW: Value Proposition (Why Choose Us) Section --- */}
        <section className="section section-light-bg">
          <h3 className="section-title">Why Choose ZYAGRA? (Our Objective)</h3>
          <div className="grid">
            {valueProps.map((prop, index) => (
              <div key={index} className="value-prop-card">
                <div className="value-icon">{prop.icon}</div>
                <h4>{prop.title}</h4>
                <p>{prop.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
