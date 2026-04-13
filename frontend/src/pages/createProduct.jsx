import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "./createProduct.css";

function CreateProduct() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    category: "",
    costPrice: "",
    sellingPrice: "",
    stock: ""
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle file select
  const handleFile = (file) => {
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // Drag drop
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await API.post("/products", form); // ✅ send JSON

    navigate("/products");
  } catch (err) {
    console.log(err);
  }
};

  return (
    <div className="create_product_page">
      <div className="form_container">
        <h2>Add Product</h2>

        <form onSubmit={handleSubmit}>
          <div 
            className="upload_box"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            {preview ? (
              <img src={preview} alt="preview" />
            ) : (
              <p>Drag & Drop Image or Click to Upload</p>
            )}

            <input
              type="file"
              accept="image/*"
              //onChange={(e) => handleFile(e.target.files[0])}
            />
          </div>
          <input name="name" placeholder="Product Name" value={form.name} onChange={handleChange} required />
          <input name="category" placeholder="Category" value={form.category} onChange={handleChange} required />
          <input name="costPrice" type="number" placeholder="Cost Price" value={form.costPrice} onChange={handleChange} required />
          <input name="sellingPrice" type="number" placeholder="Selling Price" value={form.sellingPrice} onChange={handleChange} required />
          <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} required />

          <button type="submit">Create Product</button>
        </form>
      </div>
    </div>
  );
}

export default CreateProduct;