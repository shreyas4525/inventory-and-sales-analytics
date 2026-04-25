import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Product.css";
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

    fetch("http://localhost:5000/api/products", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  // Filter products
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
              <button
                className="new"
                onClick={() => navigate("/products/create")}
              >
                + New Product
              </button>
            </div>
          </div>

          {/* Table */}
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
                {filteredProducts.map((item) => (
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

                    <td className={item.stock < 0 ? "low_stock" : ""}>
                      {item.stock}
                    </td>

                    <td>
                      <span
                        className={`status ${
                          item.stock === 0 ? "out" : "active"
                        }`}
                      >
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
                      <button
                        className="edit"
                        onClick={() => navigate(`/products/edit/${item._id}`)}
                      >
                        <i
                          className="fa-solid fa-pen-to-square"
                          style={{ color: " rgb(41, 41, 41)" }}
                        ></i>
                      </button>
                      <button
                        className="delete"
                        onClick={() => handleDelete(item._id)}
                      >
                        <i
                          className="fa-solid fa-trash-can"
                          style={{ color: "rgb(79, 79, 79)" }}
                        ></i>
                      </button>
                      <button className="cart" onClick={() => addToCart(item)}>
                        <i
                          className="fa-solid fa-cart-shopping"
                          style={{ color: " rgb(41, 41, 41)" }}
                        ></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;