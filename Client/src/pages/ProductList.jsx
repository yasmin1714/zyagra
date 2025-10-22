import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { useLocation } from "react-router-dom";

// Mock data simulating fetched products
const mockProductGroups = [
  {
    categoryName: "Fresh Vegetables",
    products: [
      {
        id: "68e270b5cf1a42fb3d3b465c",
        name: "Fresh Tomatoes",
        price: 45,
        image: "/pictures/vegetables/tomato.jpg",
      },
      {
        id: "68e27160cf1a42fb3d3b465d",
        name: "Organic Spinach",
        price: 55,
        image: "/pictures/vegetables/spinach.jpg",
      },
      {
        id: "68e1d9d85c06b082ac24eeda",
        name: "Onions (Pyaz)",
        price: 30,
        image: "/pictures/vegetables/onion.jpg",
      },
      {
        id: "68e27160cf1a42fb3d3b465e",
        name: "Potatoes (Aloo)",
        price: 25,
        image: "/pictures/vegetables/potato.jpg",
      },
      {
        id: "68e27160cf1a42fb3d3b465f",
        name: "Cauliflower",
        price: 40,
        image: "/pictures/vegetables/culiflower.jpg",
      },
      {
        id: "68e27160cf1a42fb3d3b4660",
        name: "Cucumber",
        price: 20,
        image: "/pictures/vegetables/cucumber.jpg",
      },
    ],
  },
  {
    categoryName: "Fresh Fruits",
    products: [
      {
        id: "68e271a8cf1a42fb3d3b4661",
        name: "Apples (Royal Gala)",
        price: 150,
        image: "/pictures/fruits/apple.jpg",
      },
      {
        id: "68e271a8cf1a42fb3d3b4662",
        name: "Bananas",
        price: 60,
        image: "/pictures/fruits/banana.jpg",
      },
      {
        id: "68e271a8cf1a42fb3d3b4663",
        name: "Pomegranate",
        price: 120,
        image: "/pictures/fruits/pomrgranate.jpg",
      },
      {
        id: "68e271a8cf1a42fb3d3b4664",
        name: "Grapes",
        price: 80,
        image: "/pictures/fruits/grapes(green).jpg",
      },
      {
        id: "68e271a8cf1a42fb3d3b4665",
        name: "Oranges",
        price: 90,
        image: "/pictures/fruits/orange.jpg",
      },
    ],
  },
  {
    categoryName: "Dairy & Bakery",
    products: [
      {
        id: "68e271d3cf1a42fb3d3b4666",
        name: "Fresh Milk",
        price: 32,
        image: "/pictures/dairy/milk.png",
      },
      {
        id: "68e271d3cf1a42fb3d3b4667",
        name: "Farm Fresh Eggs",
        price: 70,
        image: "/pictures/dairy/eggs.jpg",
      },
      {
        id: "68e271d3cf1a42fb3d3b4668",
        name: "Cheese",
        price: 250,
        image: "/pictures/dairy/cheese.jpg",
      },
      {
        id: "68e271d3cf1a42fb3d3b4669",
        name: "Brown Bread",
        price: 45,
        image: "/pictures/dairy/bread.jpg",
      },
      {
        id: "68e271d3cf1a42fb3d3b466a",
        name: "Butter",
        price: 52,
        image: "/pictures/dairy/butter.jpg",
      },
    ],
  },
  {
    categoryName: "Pantry Staples",
    products: [
      {
        id: "68e271fdcf1a42fb3d3b466b",
        name: "Wheat (Atta)",
        price: 220,
        image: "/pictures/pantry/wheat.jpg",
      },
      {
        id: "68e271fdcf1a42fb3d3b466c",
        name: "Salt",
        price: 25,
        image: "/pictures/pantry/salt.jpg",
      },
      {
        id: "68e271fdcf1a42fb3d3b466d",
        name: "Soyabean Oil",
        price: 135,
        image: "/pictures/pantry/oil.jpg",
      },
      {
        id: "68e271fdcf1a42fb3d3b466e",
        name: "Rice",
        price: 150,
        image: "/pictures/pantry/rice.jpg",
      },
      {
        id: "68e271fdcf1a42fb3d3b466f",
        name: "Toor Dal",
        price: 140,
        image: "/pictures/pantry/dal.jpg",
      },
    ],
  },
  {
    categoryName: "Snacks & Beverages",
    products: [
      {
        id: "68e2722ccf1a42fb3d3b4670",
        name: "Chips",
        price: 20,
        image: "/pictures/home page/chips.jpg",
      },
      {
        id: "68e2722ccf1a42fb3d3b4671",
        name: "Orange Juice",
        price: 110,
        image: "/pictures/snacks/juice.jpg",
      },
    ],
  },
  {
    categoryName: "Personal Care",
    products: [
      {
        id: "68e27291cf1a42fb3d3b4672",
        name: "Moisturizer",
        price: 180,
        image: "/pictures/personal care/1.jpg",
      },
      {
        id: "68e27291cf1a42fb3d3b4673",
        name: "Toothpaste",
        price: 95,
        image: "/pictures/personal care/brush.jpg",
      },
    ],
  },
];

const ProductList = () => {
  const location = useLocation();
  const initialCategory = location.state?.selectedCategory || "All";
  const [productGroups, setProductGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  useEffect(() => {
    setTimeout(() => {
      setProductGroups(mockProductGroups);
      setLoading(false);
    }, 1000);
  }, []);

  const categories = ["All", ...mockProductGroups.map((group) => group.categoryName)];

  const filteredProductGroups = productGroups
    .filter((group) => selectedCategory === "All" || group.categoryName === selectedCategory)
    .map((group) => {
      const filteredProducts = group.products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return { ...group, products: filteredProducts };
    })
    .filter((group) => group.products.length > 0);

  if (loading) {
    return <h2 style={{ textAlign: "center", padding: "2rem" }}>Loading products...</h2>;
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h1 style={{ textAlign: "center", marginBottom: "1rem" }}>Our Products</h1>

      {/* Search Bar */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
        <input
          type="text"
          placeholder="Search for any product..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "50%",
            maxWidth: "600px",
            padding: "12px 20px",
            fontSize: "16px",
            borderRadius: "50px",
            border: "2px solid #ddd",
            outline: "none",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#2C7A7B")}
          onBlur={(e) => (e.target.style.borderColor = "#ddd")}
        />
      </div>

      {/* Category Buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "2.5rem",
        }}
      >
        {categories.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                cursor: "pointer",
                borderRadius: "50px",
                border: "2px solid #2C7A7B",
                backgroundColor: isActive ? "#2C7A7B" : "white",
                color: isActive ? "white" : "#2C7A7B",
                fontWeight: isActive ? "bold" : "normal",
                transition: "all 0.2s ease-in-out",
              }}
            >
              {category}
            </button>
          );
        })}
      </div>

      {filteredProductGroups.length > 0 ? (
        filteredProductGroups.map((group) => (
          <div key={group.categoryName} style={{ marginBottom: "3rem" }}>
            <h2
              style={{
                marginLeft: "2rem",
                borderBottom: "2px solid #2C7A7B",
                display: "inline-block",
                paddingBottom: "0.5rem",
              }}
            >
              {group.categoryName}
            </h2>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "stretch",
                gap: "2rem",
                marginTop: "1.5rem",
              }}
            >
              {group.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <h3>No products found</h3>
          <p>Please try a different search or category.</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;
