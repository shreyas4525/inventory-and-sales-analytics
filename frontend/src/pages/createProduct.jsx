import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import "./createProduct.css";
import Sidebar from "../components/layout/Sidebar";

function CreateProduct() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    category: "",
    costPrice: "",
    sellingPrice: "",
    stock: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (file) => {
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("name", form.name);
      data.append("category", form.category);
      data.append("costPrice", form.costPrice);
      data.append("sellingPrice", form.sellingPrice);
      data.append("stock", form.stock);
      data.append("image", image);
      await API.post("/products", data);
      navigate("/products");
    } catch (err) {
      console.log(err);
    }
  };

  const margin = form.costPrice && form.sellingPrice
    ? (((form.sellingPrice - form.costPrice) / form.costPrice) * 100).toFixed(1)
    : null;

  return (
    <div className="layout">
      <Sidebar />

      <div className="main_content">
        <div className="cp_page">

          {/* ── Header ── */}
          <div className="cp_header">
            <div>
              <h2>Add Product</h2>
              <p className="cp_subtitle">Fill in the details to add a new product to inventory</p>
            </div>
            <Link to="/products" className="cp_cancel_top">
              <i className="fa-solid fa-arrow-left" /> Back to Products
            </Link>
          </div>

          {/* ── Body ── */}
          <div className="cp_body">

            {/* Left — Image upload */}
            <div className="cp_left">
              <div
                className={`upload_box${dragging ? " dragging" : ""}${preview ? " has_image" : ""}`}
                onClick={() => document.getElementById("fileInput").click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
              >
                {preview ? (
                  <>
                    <img src={preview} alt="preview" />
                    <div className="upload_overlay">
                      <i className="fa-solid fa-camera" />
                      <span>Change Image</span>
                    </div>
                  </>
                ) : (
                  <div className="upload_placeholder">
                    <div className="upload_icon">
                      <i className="fa-solid fa-cloud-arrow-up" />
                    </div>
                    <p className="upload_label">Drag & drop or click to upload</p>
                    <p className="upload_hint">PNG, JPG, WEBP up to 5MB</p>
                  </div>
                )}
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFile(e.target.files[0])}
                  hidden
                />
              </div>

              {/* Margin preview card */}
              {margin !== null && (
                <div className="margin_card">
                  <span className="stat_label">Profit Margin</span>
                  <span className={`margin_val ${parseFloat(margin) >= 0 ? "stat_green" : "stat_red"}`}>
                    {margin}%
                  </span>
                  <span className="margin_sub">
                    ₹{(form.sellingPrice - form.costPrice).toLocaleString()} per unit
                  </span>
                </div>
              )}
            </div>

            {/* Right — Form */}
            <form className="cp_form" onSubmit={handleSubmit}>

              <div className="cp_field">
                <label>Product Name</label>
                <input
                  name="name"
                  placeholder="e.g. Wireless Headphones"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="cp_field">
                <label>Category</label>
                <input
                  name="category"
                  placeholder="e.g. Electronics"
                  value={form.category}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="cp_row">
                <div className="cp_field">
                  <label>Cost Price</label>
                  <div className="cp_input_wrap">
                    <span className="cp_prefix">₹</span>
                    <input
                      name="costPrice"
                      type="number"
                      placeholder="0"
                      value={form.costPrice}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="cp_field">
                  <label>Selling Price</label>
                  <div className="cp_input_wrap">
                    <span className="cp_prefix">₹</span>
                    <input
                      name="sellingPrice"
                      type="number"
                      placeholder="0"
                      value={form.sellingPrice}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="cp_field">
                <label>Stock Quantity</label>
                <input
                  name="stock"
                  type="number"
                  placeholder="0"
                  value={form.stock}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="cp_actions">
                <Link to="/products" className="cp_cancel_btn">Cancel</Link>
                <button type="submit" className="cp_submit_btn">
                  <i className="fa-solid fa-plus" />
                  Create Product
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateProduct;
