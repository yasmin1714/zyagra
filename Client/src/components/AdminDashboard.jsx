import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../style/AdminDashboard.css";

// CHART.JS IMPORTS
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the required components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// --- MOCK DATA FOR SALES ANALYTICS ---
const mockSalesData = {
  totalSales: 154800,
  todaySales: 12500,
  currentDate: new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
};

// --- CORE COMPONENT ---
const AdminDashboard = () => {
  // --- STATE ---
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    description: "",
    price: "",
    quantity: "",
    category: "",
  });
  const [orderID, setOrderID] = useState("");
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]); // State for ALL products fetched once
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [adminInfo, setAdminInfo] = useState(null);
  const [activeTab, setActiveTab] = useState("analytics");

  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5; // Sets the 5-item limit per page

  const navigate = useNavigate();

  // --- CHART SETUP (Data and Options remain the same) ---
  const salesChartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Weekly Sales (in ₹)",
        data: [2500, 3200, 4500, 5000, 3800, 6100, 7500],
        borderColor: "#2C7A7B",
        backgroundColor: "rgba(44, 122, 123, 0.5)",
        tension: 0.3,
        pointRadius: 5,
        pointHoverRadius: 8,
      },
    ],
  };

  const salesChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Weekly Sales Performance",
        font: { size: 16 },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
              }).format(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "Revenue (₹)" } },
    },
  };

  // --- EFFECTS ---

  // 1. AUTHENTICATION EFFECT
  useEffect(() => {
    const storedAdminInfo = localStorage.getItem("adminInfo");
    if (!storedAdminInfo) {
      navigate("/admin/login", { replace: true });
      return;
    }
    try {
      const parsed = JSON.parse(storedAdminInfo);
      setAdminInfo(parsed.admin);
    } catch (error) {
      console.error("Error parsing admin info:", error);
      navigate("/admin/login", { replace: true });
    }
  }, [navigate]);

  // 2. FETCH ORDERS EFFECT (Optimized for performance)
  useEffect(() => {
    // Only fetch when on the relevant tabs
    if (activeTab !== "orders" && activeTab !== "analytics") return;

    const fetchAllOrders = async () => {
      setLoading(true);
      try {
        const storedAdminInfo = JSON.parse(localStorage.getItem("adminInfo"));
        if (!storedAdminInfo || !storedAdminInfo.token) {
          throw new Error("Unauthorized: Please log in again.");
        }

        const response = await fetch(
          "http://localhost:5001/api/orders/allorders",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${storedAdminInfo.token}` },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch orders.");
        }
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setMessage(`Error fetching orders: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchAllOrders();
  }, [activeTab]);

  // 3. FETCH PRODUCTS EFFECT (Optimized for performance)
  useEffect(() => {
    // Only fetch when specifically on the products tab
    if (activeTab !== "products") return;

    const fetchAllProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5001/api/products", {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch products.");
        }

        const data = await response.json();
        setProducts(data);
        setCurrentPage(1); // Reset to page 1 on new fetch
      } catch (err) {
        setMessage(`Error fetching product list: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, [activeTab]);

  // --- HANDLERS ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (message) setMessage("");
  };

  const handleOrderChange = (e) => {
    setOrderID(e.target.value);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminInfo");
    navigate("/admin/login", { replace: true });
  };

  // --- PRODUCT SUBMISSION HANDLER (NEW PRODUCT ADDED TO THE TOP) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const storedAdminInfo = JSON.parse(localStorage.getItem("adminInfo"));
      if (!storedAdminInfo || !storedAdminInfo.token) {
        throw new Error("You are not authorized. Please login again.");
      }

      const response = await fetch("http://localhost:5001/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedAdminInfo.token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to add product");
      }

      setMessage(
        `✅ Successfully added product: ${data.name || formData.name}`
      );

      // OPTIMIZATION: Update state locally - PREPENDS the new product to the list
      setFormData({
        name: "",
        image: "",
        description: "",
        price: "",
        quantity: "",
        category: "",
      });
      setProducts((prev) => [data, ...prev]);
      setCurrentPage(1); // Show the new product immediately on the first page
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // --- PRODUCT DELETION HANDLER ---
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }
    setMessage("");
    setLoading(true);

    try {
      const storedAdminInfo = JSON.parse(localStorage.getItem("adminInfo"));
      if (!storedAdminInfo || !storedAdminInfo.token) {
        throw new Error("You are not authorized. Please login again.");
      }

      const response = await fetch(
        `http://localhost:5001/api/products/${productId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${storedAdminInfo.token}` },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete product");
      }

      setMessage(
        `✅ Successfully deleted product: ${
          data.name || productId.substring(0, 8)
        }...`
      );

      // OPTIMIZATION: Update state locally
      setProducts(products.filter((p) => p._id !== productId));

      // Adjust page if necessary
      const totalProductsAfterDelete = products.length - 1;
      const maxPages = Math.ceil(totalProductsAfterDelete / productsPerPage);
      if (currentPage > maxPages) {
        setCurrentPage(maxPages > 0 ? maxPages : 1);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // --- ORDER UPDATE HANDLER (Unchanged) ---
  const updateOrders = async (e) => {
    e.preventDefault();
    if (!orderID) return setMessage("Please select an Order ID to update.");
    setMessage("");
    setLoading(true);

    try {
      const storedAdminInfo = JSON.parse(localStorage.getItem("adminInfo"));
      const response = await fetch(
        "http://localhost:5001/api/orders/updateorder",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedAdminInfo.token}`,
          },
          body: JSON.stringify({ orderId: orderID }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `Failed to Update Order Details`);
      }

      setMessage(
        `✅ Order ${orderID.substring(0, 8)}... updated successfully!`
      );
      setOrderID("");

      // Re-fetch orders to update the table immediately
      const orderResponse = await fetch(
        "http://localhost:5001/api/orders/allorders",
        {
          method: "GET",
          headers: { Authorization: `Bearer ${storedAdminInfo.token}` },
        }
      );

      const orderData = await orderResponse.json();
      setOrders(orderData);
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // --- UI HELPERS ---
  const isOutOfStock = (quantityString) => {
    const numQty = parseFloat(quantityString);
    return (
      numQty === 0 ||
      String(quantityString).toLowerCase().includes("out of stock")
    );
  };

  // --- PAGINATION LOGIC (CORE for lag reduction) ---
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(products.length / productsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  // -------------------------

  if (!adminInfo) {
    return (
      <div className="admin-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  // --- STYLES (Kept as before) ---
  const tabStyles = (tab) => ({
    padding: "10px 20px",
    cursor: "pointer",
    border: "none",
    borderBottom:
      activeTab === tab ? "3px solid #2C7A7B" : "3px solid transparent",
    backgroundColor: "transparent",
    fontWeight: activeTab === tab ? "bold" : "normal",
    color: activeTab === tab ? "#2C7A7B" : "#555",
    fontSize: "1rem",
    marginRight: "10px",
    transition: "all 0.3s",
  });

  const cardContainerStyle = {
    display: "flex",
    justifyContent: "space-around",
    gap: "20px",
    margin: "30px 0",
  };
  const statCardStyle = {
    flex: 1,
    minWidth: "200px",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    textAlign: "center",
    backgroundColor: "#fff",
  };

  // --- RENDER FUNCTION ---
  return (
    <div className="admin-container">
      <main className="admin-main-content">
        {/* Header and Tab Navigation */}
        <div className="admin-header">
          <h1 className="admin-title">Admin Dashboard</h1>
          <div className="admin-nav">
            <h3 className="admin-welcome">Welcome, {adminInfo.email}</h3>
            <button onClick={handleLogout} className="logout-button">
              🚪 Logout
            </button>
          </div>
        </div>

        <nav
          className="tab-navigation"
          style={{ borderBottom: "1px solid #ddd", marginBottom: "20px" }}
        >
          <button
            style={tabStyles("analytics")}
            onClick={() => setActiveTab("analytics")}
          >
            📊 Sales & Analytics
          </button>
          <button
            style={tabStyles("products")}
            onClick={() => setActiveTab("products")}
          >
            🛒 Product Management
          </button>
          <button
            style={tabStyles("orders")}
            onClick={() => setActiveTab("orders")}
          >
            📦 Manage Orders ({orders.length})
          </button>
        </nav>

        {message && (
          <div
            className={`message ${
              message.includes("✅") ? "success" : "error"
            }`}
          >
            {message}
          </div>
        )}
        {loading && (
          <p style={{ textAlign: "center", fontWeight: "bold" }}>
            Processing...
          </p>
        )}

        {/* --- TAB CONTENT: SALES & ANALYTICS --- */}
        {activeTab === "analytics" && (
          <div className="analytics-view">
            <h2>Sales Overview</h2>
            <div style={cardContainerStyle}>
              <div style={{ ...statCardStyle, backgroundColor: "#E6FFFA" }}>
                <h4 style={{ color: "#2C7A7B" }}>Current Date</h4>
                <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                  {mockSalesData.currentDate}
                </p>
              </div>
              <div style={{ ...statCardStyle, backgroundColor: "#F0FFF4" }}>
                <h4 style={{ color: "#38A169" }}>Total Sales (Lifetime)</h4>
                <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                  ₹{mockSalesData.totalSales.toLocaleString()}
                </p>
              </div>
              <div style={{ ...statCardStyle, backgroundColor: "#FEFCBF" }}>
                <h4 style={{ color: "#D69E2E" }}>Today's Sales</h4>
                <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                  ₹{mockSalesData.todaySales.toLocaleString()}
                </p>
              </div>
            </div>
            <div
              className="sales-graph-container"
              style={{
                marginTop: "40px",
                padding: "20px",
                border: "1px solid #eee",
                borderRadius: "8px",
                backgroundColor: "#fff",
                height: "400px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Line data={salesChartData} options={salesChartOptions} />
            </div>
          </div>
        )}

        {/* --- TAB CONTENT: PRODUCT MANAGEMENT (PAGINATED, LATEST FIRST) --- */}
        {activeTab === "products" && (
          <div className="product-management-view">
            {/* 1. Add Product Form */}
            <div
              className="product-form-container"
              style={{ marginBottom: "40px" }}
            >
              <form onSubmit={handleSubmit} className="product-form">
                <h1>Add New Product</h1>
                <p>Use this form to add a new item to the store catalog.</p>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Product Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter product name"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <input
                      type="text"
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      placeholder="e.g., Electronics, Clothing"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="price">Price (Rs)</label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="quantity">
                      Quantity (e.g., 500g, 1 piece, 0 for out of stock)
                    </label>
                    <input
                      type="text"
                      id="quantity"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      placeholder="e.g., 500g, 1 piece"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="image">Image URL</label>
                  <input
                    type="url"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter product description"
                    rows="4"
                    required
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  className="submit-button"
                  disabled={loading}
                >
                  {loading ? "Adding Product..." : "➕ Add Product"}
                </button>
              </form>
            </div>

            {/* 2. Product List (PAGINATED, LATEST FIRST) */}
            <h2
              style={{
                marginTop: "30px",
                borderBottom: "2px solid #ddd",
                paddingBottom: "10px",
              }}
            >
              All Products ({products.length}) - Page {currentPage} of{" "}
              {totalPages}
            </h2>

            {products.length === 0 && !loading ? (
              <p>No products found in the catalog.</p>
            ) : (
              <>
                <table
                  className="products-table"
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginTop: "15px",
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: "#f4f4f4" }}>
                      <th
                        style={{
                          padding: "10px",
                          border: "1px solid #ddd",
                          textAlign: "left",
                        }}
                      >
                        ID
                      </th>
                      <th
                        style={{
                          padding: "10px",
                          border: "1px solid #ddd",
                          textAlign: "center",
                        }}
                      >
                        Image
                      </th>
                      <th
                        style={{
                          padding: "10px",
                          border: "1px solid #ddd",
                          textAlign: "left",
                        }}
                      >
                        Name
                      </th>
                      <th
                        style={{
                          padding: "10px",
                          border: "1px solid #ddd",
                          textAlign: "left",
                        }}
                      >
                        Category
                      </th>
                      <th
                        style={{
                          padding: "10px",
                          border: "1px solid #ddd",
                          textAlign: "right",
                        }}
                      >
                        Price (₹)
                      </th>
                      <th
                        style={{
                          padding: "10px",
                          border: "1px solid #ddd",
                          textAlign: "right",
                        }}
                      >
                        Quantity Unit
                      </th>
                      <th
                        style={{
                          padding: "10px",
                          border: "1px solid #ddd",
                          textAlign: "center",
                        }}
                      >
                        Stock Status
                      </th>
                      <th
                        style={{
                          padding: "10px",
                          border: "1px solid #ddd",
                          textAlign: "center",
                        }}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* MODIFIED: Reverses the 5 products on the current page to display latest products first. */}
                    {[...currentProducts].reverse().map((product) => {
                      const outOfStock = isOutOfStock(product.quantity);
                      return (
                        <tr
                          key={product._id}
                          style={{
                            borderBottom: "1px solid #eee",
                            backgroundColor: outOfStock ? "#FFEEEE" : "white",
                          }}
                        >
                          <td
                            style={{
                              padding: "10px",
                              border: "1px solid #ddd",
                              fontSize: "0.8em",
                            }}
                          >
                            {product._id.substring(0, 5)}...
                          </td>
                          <td
                            style={{
                              padding: "10px",
                              border: "1px solid #ddd",
                              textAlign: "center",
                            }}
                          >
                            <img
                              src={product.image}
                              alt={product.name}
                              style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                                borderRadius: "4px",
                              }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/placeholder.jpg";
                              }}
                            />
                          </td>
                          <td
                            style={{
                              padding: "10px",
                              border: "1px solid #ddd",
                            }}
                          >
                            {product.name}
                          </td>
                          <td
                            style={{
                              padding: "10px",
                              border: "1px solid #ddd",
                            }}
                          >
                            {product.category}
                          </td>
                          <td
                            style={{
                              padding: "10px",
                              border: "1px solid #ddd",
                              textAlign: "right",
                              fontWeight: "bold",
                            }}
                          >
                            ₹{product.price.toFixed(2)}
                          </td>
                          <td
                            style={{
                              padding: "10px",
                              border: "1px solid #ddd",
                              textAlign: "right",
                            }}
                          >
                            {product.quantity}
                          </td>
                          <td
                            style={{
                              padding: "10px",
                              border: "1px solid #ddd",
                              textAlign: "center",
                              fontWeight: "bold",
                              color: outOfStock ? "#E53E3E" : "#38A169",
                            }}
                          >
                            {outOfStock ? "❌ Out of Stock" : "✅ In Stock"}
                          </td>
                          <td
                            style={{
                              padding: "10px",
                              border: "1px solid #ddd",
                              textAlign: "center",
                            }}
                          >
                            <button
                              onClick={() => handleDeleteProduct(product._id)}
                              disabled={loading}
                              style={{
                                padding: "8px 12px",
                                backgroundColor: "#E53E3E",
                                color: "white",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                fontSize: "0.9em",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "5px",
                                margin: "auto",
                              }}
                              title="Delete Product"
                            >
                              Delete 🗑️
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Pagination Controls */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "20px",
                    alignItems: "center",
                    gap: "15px",
                  }}
                >
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1 || loading}
                    style={{
                      padding: "10px 15px",
                      border: "1px solid #2C7A7B",
                      backgroundColor: "#2C7A7B",
                      color: "white",
                      borderRadius: "5px",
                      cursor: "pointer",
                      opacity: currentPage === 1 ? 0.5 : 1,
                    }}
                  >
                    Previous
                  </button>
                  <span style={{ margin: "0 10px", fontWeight: "bold" }}>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages || loading}
                    style={{
                      padding: "10px 15px",
                      border: "1px solid #2C7A7B",
                      backgroundColor: "#2C7A7B",
                      color: "white",
                      borderRadius: "5px",
                      cursor: "pointer",
                      opacity: currentPage === totalPages ? 0.5 : 1,
                    }}
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* --- TAB CONTENT: MANAGE ORDERS --- */}
        {activeTab === "orders" && (
          <div className="my-orders-container">
            <h1>Order Management</h1>
            {loading && <p>Loading orders...</p>}
            {orders.length === 0 && !loading ? (
              <div className="no-orders">
                <p>No orders found.</p>
                <Link to="/" className="shop-now-link">
                  Go back to shop
                </Link>
              </div>
            ) : (
              <div className="order-management-area">
                {/* Update Order Form */}
                <form onSubmit={updateOrders} className="update-order-form">
                  <h4>Update Order Status</h4>
                  <select
                    name="order-id"
                    id="orderID"
                    value={orderID}
                    onChange={handleOrderChange}
                  >
                    <option value="">
                      Select An Order ID to mark as delivered
                    </option>
                    {orders.map((order) => (
                      <option
                        key={order._id}
                        value={order._id}
                        disabled={order.isDelivered}
                      >
                        {order._id.substring(0, 10)}... -{" "}
                        {order.isDelivered ? "DELIVERED" : "PENDING"}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="submit-button"
                    disabled={loading || !orderID}
                  >
                    📦 Update to Delivered
                  </button>
                </form>
                <br />
                {/* Orders Table */}
                <h4>Order Status List</h4>
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Order Date</th>
                      <th>Customer Details</th>
                      <th>Order Details</th>
                      <th>Order Total</th>
                      <th>Payment Status</th>
                      <th>Delivery Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td>{order._id.substring(0, 10)}...</td>
                        <td>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          <div className="card">
                            <div className="container">
                              <p>
                                🛍️ {order.shippingAddress?.address},{" "}
                                {order.shippingAddress?.city}
                              </p>
                              <p>📞 {order.phone}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          {order.orderItems.map((item, index) => (
                            <ul
                              key={index}
                              style={{
                                margin: "5px 0",
                                padding: 0,
                                listStyle: "none",
                              }}
                            >
                              <div
                                className="card"
                                style={{
                                  border: "1px solid #f0f0f0",
                                  padding: "5px",
                                  borderRadius: "4px",
                                }}
                              >
                                <div className="container">
                                  <h6>
                                    <b>{item.name}</b>
                                  </h6>
                                  <p style={{ margin: 0, fontSize: "0.9em" }}>
                                    🛒 Qty: {item.qty} | 🏷️ Rs. {item.price}
                                  </p>
                                </div>
                              </div>
                            </ul>
                          ))}
                        </td>
                        <td>₹{order.totalPrice}</td>
                        <td>
                          {order.isPaid ? (
                            <div>
                              <span
                                className="status-paid"
                                style={{ color: "green", fontWeight: "bold" }}
                              >
                                Paid
                              </span>
                              <p style={{ fontSize: "0.8em" }}>
                                {new Date(order.paidAt).toLocaleDateString()}
                              </p>
                            </div>
                          ) : (
                            <span
                              className="status-not-paid"
                              style={{ color: "red", fontWeight: "bold" }}
                            >
                              Not Paid
                            </span>
                          )}
                        </td>
                        <td>
                          {order.isDelivered ? (
                            <div>
                              <span
                                className="status-delivered"
                                style={{ color: "blue", fontWeight: "bold" }}
                              >
                                Delivered
                              </span>
                              <p style={{ fontSize: "0.8em" }}>
                                {new Date(
                                  order.deliveredAt
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          ) : (
                            <span
                              className="status-not-delivered"
                              style={{ color: "orange", fontWeight: "bold" }}
                            >
                              Pending
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
