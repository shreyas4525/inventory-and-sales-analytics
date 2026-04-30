import { useState } from "react";
import API from "../api/axios";
import "./cart.css";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar"; // ← your sidebar
import BarcodeScanner from "../components/BarcodeScanner";

function Cart() {
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );
  const [showScanner, setShowScanner] = useState(false);
  const navigate = useNavigate();

  const increaseQty = (id) => {
    const updated = cart.map((item) =>
      item._id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const handleScan = (product) => {
    const updatedCart = (() => {
      const existing = cart.find((p) => p._id === product._id);
      if (existing) {
        return cart.map((p) =>
          p._id === product._id ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [...cart, { ...product, quantity: 1 }];
    })();
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const decreaseQty = (id) => {
    const updated = cart.map((item) =>
      item._id === id
        ? { ...item, quantity: Math.max(1, item.quantity - 1) }
        : item
    );
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const removeItem = (id) => {
    const updated = cart.filter((item) => item._id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const total = cart.reduce(
    (sum, item) => sum + item.sellingPrice * item.quantity,
    0
  );

  const handleCheckout = async () => {
    try {
      const items = cart.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
      }));
      await API.post("/sales", { items });
      alert("Sale created successfully ✅");
      navigate("/products");
      setCart([]);
      localStorage.removeItem("cart");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="layout">
      <Sidebar />

      <div className="main_content">
        <div className="cart_page">

          {/* ── Page header ── */}
          <div className="cart_page_header">
            <div>
              <h2>Cart</h2>
              <p className="cart_subtitle">
                {cart.length === 0
                  ? "Your cart is empty"
                  : `${cart.length} item${cart.length > 1 ? "s" : ""} ready for checkout`}
              </p>
            </div>

            <button
              onClick={() => setShowScanner(true)}
              className="scan_btn"
            >
              <i className="fa-solid fa-barcode" />
              Scan Barcode
            </button>
          </div>

          {/* ── Stats strip ── */}
          <div className="cart_stats">
            <div className="cart_stat">
              <span className="stat_label">Items</span>
              <span className="stat_value">{cart.length}</span>
            </div>
            <div className="cart_stat">
              <span className="stat_label">Units</span>
              <span className="stat_value">
                {cart.reduce((s, i) => s + i.quantity, 0)}
              </span>
            </div>
            <div className="cart_stat">
              <span className="stat_label">Total</span>
              <span className="stat_value stat_green">₹{total.toLocaleString()}</span>
            </div>
          </div>

          {/* ── Scanner Modal ── */}
          {showScanner && (
            <div className="scanner_modal">
              <div className="scanner_box">
                <div className="scanner_header">
                  <span className="scanner_title">
                    <i className="fa-solid fa-camera" /> Scan Product
                  </span>
                  <button
                    className="scanner_close"
                    onClick={() => setShowScanner(false)}
                  >
                    <i className="fa-solid fa-xmark" />
                  </button>
                </div>
                <BarcodeScanner
                  onScan={(product) => {
                    handleScan(product);
                    setTimeout(() => setShowScanner(false), 100);
                  }}
                />
              </div>
            </div>
          )}

          {/* ── Table ── */}
          <div className="cart_table_container">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Unit Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cart.length === 0 ? (
                  <tr>
                    <td colSpan="5">
                      <div className="empty_state">
                        <i className="fa-solid fa-cart-shopping" style={{ fontSize: 32, marginBottom: 10, color: "var(--text-muted)" }} />
                        <p>No items in cart — add products or scan a barcode</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  cart.map((item) => (
                    <tr key={item._id}>
                      {/* Product */}
                      <td>
                        <div className="product">
                          <img
                            src={item.image || "/noproduct.jpg"}
                            alt={item.name}
                            onError={(e) => (e.target.src = "/noproduct.jpg")}
                          />
                          <span>{item.name}</span>
                        </div>
                      </td>

                      {/* Unit price */}
                      <td>₹{item.sellingPrice.toLocaleString()}</td>

                      {/* Quantity */}
                      <td>
                        <div className="qty_control">
                          <button
                            className="qty_btn"
                            onClick={() => decreaseQty(item._id)}
                          >
                            <i className="fa-solid fa-minus" />
                          </button>
                          <span className="qty_num">{item.quantity}</span>
                          <button
                            className="qty_btn"
                            onClick={() => increaseQty(item._id)}
                          >
                            <i className="fa-solid fa-plus" />
                          </button>
                        </div>
                      </td>

                      {/* Subtotal */}
                      <td className="subtotal_cell">
                        ₹{(item.sellingPrice * item.quantity).toLocaleString()}
                      </td>

                      {/* Remove */}
                      <td>
                        <button
                          className="remove_btn"
                          onClick={() => removeItem(item._id)}
                          title="Remove"
                        >
                          <i className="fa-solid fa-trash-can" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ── Footer ── */}
          {cart.length > 0 && (
            <div className="cart_footer">
              <div className="cart_total_block">
                <span className="cart_total_label">Order Total</span>
                <span className="cart_total_value">₹{total.toLocaleString()}</span>
              </div>
              <button onClick={handleCheckout} className="checkout_btn">
                <i className="fa-solid fa-check" />
                Confirm & Checkout
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Cart;
