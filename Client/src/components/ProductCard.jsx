import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const cardStyles = {
  border: "1px solid #ddd",
  borderRadius: "12px",
  padding: "1rem",
  width: "260px",
  height: "380px",
  textAlign: "center",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  transition: "transform 0.3s ease",
  backgroundColor: "#fff",
};

const imageStyles = {
  width: "100%",
  height: "180px",
  objectFit: "cover",
  borderRadius: "8px",
  marginBottom: "10px",
};

const buttonStyles = {
  cursor: "pointer",
  backgroundColor: "#2C7A7B",
  color: "white",
  border: "none",
  padding: "10px 20px",
  borderRadius: "5px",
  marginTop: "1rem",
  transition: "background-color 0.3s",
};

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setIsWishlisted(wishlist.some((item) => item.id === product.id));
  }, [product.id]);

  const toggleWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    if (isWishlisted) {
      const updated = wishlist.filter((item) => item.id !== product.id);
      localStorage.setItem("wishlist", JSON.stringify(updated));
      setIsWishlisted(false);
    } else {
      const updated = [...wishlist, product];
      localStorage.setItem("wishlist", JSON.stringify(updated));
      setIsWishlisted(true);
    }
  };

  return (
    <div
      style={{
        ...cardStyles,
        transform: isWishlisted ? "scale(1.03)" : "scale(1)",
      }}
    >
      <img src={product.image} alt={product.name} style={imageStyles} />
      <div>
        <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>{product.name}</h3>
        <p style={{ fontWeight: "bold", color: "#2C7A7B", marginBottom: "0.5rem" }}>
          ₹{product.price.toFixed(2)}
        </p>
      </div>
      <div>
        <button
          onClick={toggleWishlist}
          aria-pressed={isWishlisted}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: isWishlisted ? "#e53e3e" : "#bbb",
            fontSize: "1.5rem",
            marginRight: "10px",
          }}
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          {isWishlisted ? <FaHeart /> : <FaRegHeart />}
        </button>
        <button style={buttonStyles} onClick={() => addToCart(product)}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
