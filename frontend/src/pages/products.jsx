import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./product.css";
import API from "../api/axios";
import Sidebar from "../components/layout/Sidebar";

const Products = () => {
  const [products, setProducts] = useState([]);
  const categories = ["all", ...new Set(products.map(p => p.category).filter(Boolean))];
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    API.get("/products", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || p.category === category;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (id) => {
    try {
      await API.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const addToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((item) => item._id === product._id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  const isEmpty = filteredProducts.length === 0;
  const isFiltered = search || category !== "all";

  const EmptyState = () => (
    <div className="empty_state">
      <i className="fa-solid fa-box-open" style={{ fontSize: "36px", color: "var(--text-muted)" }}></i>
      {isFiltered ? (
        <>
          <p style={{ color: "var(--text-secondary)", fontWeight: 500 }}>No products found</p>
          <p style={{ marginTop: 4 }}>Try adjusting your search or filter.</p>
        </>
      ) : (
        <>
          <p style={{ color: "var(--text-secondary)", fontWeight: 500 }}>No products yet</p>
          <p style={{ marginTop: 4 }}>Get started by adding your first product.</p>
        </>
      )}
    </div>
  );

  return (
    <div className="layout">
      <Sidebar />
      <div className="main_content">
        <div className="products_page">
          <h2>Products</h2>

          {/* Header */}
          <div className="header">
            <div className="controls">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                className="filter"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((cat, index) => (
                  <option key={index} value={cat}>
                    {cat === "all" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="actions">
              <button className="new" onClick={() => navigate("/products/create")}>
                + New Product
              </button>
            </div>
          </div>

          {/* Table — desktop */}
          <div className="table_container">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Cost</th>
                  <th>Selling</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Barcode</th>
                  <th>Buttons</th>
                </tr>
              </thead>
              <tbody>
                {isEmpty ? (
                  <tr>
                    <td colSpan="8" style={{ padding: 0, border: "none" }}>
                      <EmptyState />
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((item) => (
                    <tr key={item._id}>
                      <td className="product">
                        <img
                          src={item.image || "/noproduct.jpg"}
                          alt={item.name}
                          onError={(e) => (e.target.src = "/noproduct.jpg")}
                        />
                        <span>{item.name}</span>
                      </td>
                      <td>{item.category || "—"}</td>
                      <td>₹{item.costPrice}</td>
                      <td>₹{item.sellingPrice}</td>
                      <td className={item.stock < 0 ? "low_stock" : ""}>{item.stock}</td>
                      <td>
                        <span className={`status ${item.stock === 0 ? "out" : "active"}`}>
                          {item.stock === 0 ? "Out of Stock" : "Active"}
                        </span>
                      </td>
                      <td className="barcode_cell">
                        <div className="barcode_box">
                          <img
                            src={`https://barcode.tec-it.com/barcode.ashx?data=${item.barcode}&code=Code128`}
                            alt="barcode"
                          />
                        </div>
                      </td>
                      <td className="actions_btns">
                        <button className="edit" onClick={() => navigate(`/products/edit/${item._id}`)}>
                          <i className="fa-solid fa-pen-to-square" style={{ color: "rgb(112, 124, 255)" }}></i>
                        </button>
                        <button className="delete" onClick={() => handleDelete(item._id)}>
                          <i className="fa-solid fa-trash-can" style={{ color: "rgb(253, 104, 104)" }}></i>
                        </button>
                        <button className="cart" onClick={() => addToCart(item)}>
                          <i className="fa-solid fa-cart-shopping" style={{ color: "rgb(109, 255, 148)" }}></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="mobile_cards">
            {isEmpty ? (
              <EmptyState />
            ) : (
              filteredProducts.map((item) => (
                <div className="product_card" key={item._id}>
                  <div className="product_card_top">
                    <img
                      src={item.image || "/noproduct.jpg"}
                      alt={item.name}
                      onError={(e) => (e.target.src = "/noproduct.jpg")}
                    />
                    <div>
                      <div className="product_card_name">{item.name}</div>
                      <div className="product_card_category">{item.category || "—"}</div>
                    </div>
                    <div className="product_card_meta">
                      <span className={`status ${item.stock === 0 ? "out" : "active"}`}>
                        {item.stock === 0 ? "Out of Stock" : "Active"}
                      </span>
                    </div>
                  </div>
                  <div className="product_card_grid">
                    <div className="product_card_field">
                      <span className="field_label">Cost</span>
                      <span className="field_value">₹{item.costPrice}</span>
                    </div>
                    <div className="product_card_field">
                      <span className="field_label">Selling</span>
                      <span className="field_value">₹{item.sellingPrice}</span>
                    </div>
                    <div className="product_card_field">
                      <span className="field_label">Stock</span>
                      <span className={`field_value ${item.stock < 0 ? "low_stock" : ""}`}>
                        {item.stock}
                      </span>
                    </div>
                    <div className="product_card_field">
                      <span className="field_label">Barcode</span>
                      <div className="barcode_box">
                        <img
                          src={`https://barcode.tec-it.com/barcode.ashx?data=${item.barcode}&code=Code128`}
                          alt="barcode"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="product_card_footer">
                    <div className="actions_btns">
                      <button className="edit" onClick={() => navigate(`/products/edit/${item._id}`)}>
                        <i className="fa-solid fa-pen-to-square" style={{ color: "rgb(49, 49, 50)" }}></i>
                      </button>
                      <button className="delete" onClick={() => handleDelete(item._id)}>
                        <i className="fa-solid fa-trash-can" style={{ color: "rgb(254, 31, 31)" }}></i>
                      </button>
                      <button className="cart" onClick={() => addToCart(item)}>
                        <i className="fa-solid fa-cart-shopping" style={{ color: "rgb(34, 248, 91)" }}></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Products;