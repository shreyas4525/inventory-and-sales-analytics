import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Product.css";
import API from "../api/axios";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
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
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );
  const handleDelete = async (id) => {
  try {
    await API.delete(`/products/${id}`);

    setProducts((prev) => prev.filter((p) => p._id !== id));

  } catch (err) {
    console.log(err);
  }
};

  return (
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
        <button className="filter">Filters</button>
      </div>

      <div className="actions">
          <button className="new" onClick={() => navigate("/products/create")}>+ New Product</button>
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
              <th></th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((item) => (
              <tr key={item._id}>

                <td className="product">
                  <img src="/productcard.jpg" alt="" />
                  <span>{item.name}</span>
                </td>

                <td>{item.category || "—"}</td>
                <td>₹{item.costPrice}</td>
                <td>₹{item.sellingPrice}</td>

                <td className={item.stock < 0 ? "low_stock" : ""}>
                  {item.stock}
                </td>

                <td>
                  <span className={`status ${item.stock === 0 ? "out" : "active"}`}>
                    {item.stock === 0 ? "Out of Stock" : "Active"}
                  </span>
                </td>

                <td className="actions_btns">
                  <button className="edit">Edit</button>
                  <button className="delete" onClick={() => handleDelete(item._id)}>Delete</button>
                  <button 
                      className="cart"
                      onClick={() => addToCart(item)}
                    >
                      Add to Cart
                    </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
};

export default Products;