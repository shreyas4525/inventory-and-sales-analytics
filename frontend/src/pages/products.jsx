import React, { useEffect, useState } from "react";
import "./Product.css";

const Products = () => {
  const [products, setProducts] = useState([]);

  // Fetch products of logged-in user
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

  return (
    <div className="products_container">

      <h1>My Products</h1>

      {/* Add Button */}
      <div className="top_bar">
        <button className="add_btn">+ Add Product</button>
      </div>

      {/* Cards */}
      <div className="card_grid">
        {products.map((item) => (
          <div className="product_card" key={item._id}>

            <h2>{item.name}</h2>

            <p><strong>Category:</strong> {item.category || "—"}</p>

            <p><strong>Cost:</strong> ₹{item.costPrice}</p>
            <p><strong>Selling:</strong> ₹{item.sellingPrice}</p>

            <p className={item.stock < 10 ? "low_stock" : ""}>
              <strong>Stock:</strong> {item.stock}
            </p>

            <p>
              <strong>Profit:</strong> ₹{item.sellingPrice - item.costPrice}
            </p>

            <p>
              <strong>Supplier:</strong><br />
              {item.supplier?.name} <br />
              <small>{item.supplier?.phone}</small>
            </p>

            {/* Status */}
            <div className="status">
              {item.stock < 10 ? (
                <span className="low">Low Stock</span>
              ) : (
                <span className="ok">In Stock</span>
              )}
            </div>

            {/* Actions */}
            <div className="actions">
              <button className="edit">Edit</button>
              <button className="delete">Delete</button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

export default Products;