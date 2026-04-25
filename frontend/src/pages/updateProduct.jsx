import { useState, useEffect } from "react";
import { useNavigate, useParams,Link } from "react-router-dom";
import API from "../api/axios";
import "./createProduct.css";
import Navbar from "../components/layout/Navbar";


function UpdateProduct() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    name: "",
    category: "",
    costPrice: "",
    sellingPrice: "",
    stock: ""
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle file select
  const handleFile = (file) => {
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // Drag & drop
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/${id}`);

        setForm({
          name: res.data.name || "",
          category: res.data.category || "",
          costPrice: res.data.costPrice || "",
          sellingPrice: res.data.sellingPrice || "",
          stock: res.data.stock || ""
        });

        if (res.data.image) {
          setPreview(res.data.image);
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      data.append("name", form.name);
      data.append("category", form.category);
      data.append("costPrice", form.costPrice);
      data.append("sellingPrice", form.sellingPrice);
      data.append("stock", form.stock);

      // 🔥 only send image if user selected new one
      if (image) {
        data.append("image", image);
      }

      await API.put(`/products/${id}`, data);

      navigate("/products");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
    <div className="create_product_page">
      <div className="form_container">
        <h2>Update Product</h2>

        <form onSubmit={handleSubmit}>
          {/* Image Upload */}
          <div
            className="upload_box"
            onClick={() => document.getElementById("fileInput").click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            {preview ? (
              <img src={preview} alt="preview" />
            ) : (
              <p>Drag & Drop Image or Click to Upload</p>
            )}

            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={(e) => handleFile(e.target.files[0])}
              hidden
            />
          </div>

          {/* Inputs */}
          <input
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            required
          />

          <input
            name="costPrice"
            type="number"
            placeholder="Cost Price"
            value={form.costPrice}
            onChange={handleChange}
            required
          />

          <input
            name="sellingPrice"
            type="number"
            placeholder="Selling Price"
            value={form.sellingPrice}
            onChange={handleChange}
            required
          />

          <input
            name="stock"
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
            required
          />

          <div className="btn_container">
            <Link to="/">Cancel</Link>
            <button type="submit">Update Product</button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}

export default UpdateProduct;

