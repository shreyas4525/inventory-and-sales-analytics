import { useState } from "react";
import API from "../api/axios";
import "./cart.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import BarcodeScanner from "../components/BarcodeScanner";


function Cart() {
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );
  const [showScanner, setShowScanner] = useState(false);
  const navigate = useNavigate();
  // Increase quantity
  const increaseQty = (id) => {
    const updated = cart.map((item) =>
      item._id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };
  //Barcode Scanning

  const handleScan = (product) => {
  const updatedCart = (() => {
    const existing = cart.find((p) => p._id === product._id);

    if (existing) {
      return cart.map((p) =>
        p._id === product._id
          ? { ...p, quantity: p.quantity + 1 }
          : p
      );
    }

    return [...cart, { ...product, quantity: 1 }];
  })();

  setCart(updatedCart);
  localStorage.setItem("cart", JSON.stringify(updatedCart)); // ✅ SAVE
};

  // Decrease quantity
  const decreaseQty = (id) => {
    const updated = cart.map((item) =>
      item._id === id
        ? { ...item, quantity: Math.max(1, item.quantity - 1) }
        : item
    );
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // Remove item
  const removeItem = (id) => {
    const updated = cart.filter((item) => item._id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // Total calculation
  const total = cart.reduce(
    (sum, item) => sum + item.sellingPrice * item.quantity,
    0
  );

  // ✅ CHECKOUT → CREATE SALE
  const handleCheckout = async () => {
    try {
      const items = cart.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
      }));

      await API.post("/sales", { items });

      alert("Sale created successfully ✅");
      navigate("/products");

      // clear cart
      setCart([]);
      localStorage.removeItem("cart");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Navbar />

      <div className="cart_page">
        <h2>Cart</h2>

        {/* ✅ SCAN BUTTON */}
        <div className="scanner_top">
          <button
            onClick={() => setShowScanner(true)}
            className="scan_btn"
          >
            📷 Scan Barcode
          </button>
        </div>

        {/* ✅ SCANNER MODAL */}
        {showScanner && (
          <div className="scanner_modal">
            <div className="scanner_box">

              <div className="scanner_header">
                <h3>Scan Product</h3>
                <button onClick={() => setShowScanner(false)}>✖</button>
              </div>

              <BarcodeScanner
                onScan={(product) => {
                  handleScan(product);
                  setShowScanner(false); // auto close
                }}
              />

            </div>
          </div>
        )}

        {/* CART */}
        <div className="cart_wrapper">
          <div className="cart_table">

            <div className="cart_header">
              <span>Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Total</span>
            </div>

            {cart.length === 0 ? (
              <p style={{ textAlign: "center", marginTop: "20px" }}>
                No items in cart
              </p>
            ) : (
              cart.map((item) => (
                <div className="cart_row" key={item._id}>

                  {/* Product */}
                  <div className="product_info">
                    <button onClick={() => removeItem(item._id)}>
                      <i className="fa-solid fa-trash-can"></i>
                    </button>

                    <img
                      src={item.image || "/noproduct.jpg"}
                      alt={item.name}
                      onError={(e) =>
                        (e.target.src = "/noproduct.jpg")
                      }
                    />

                    <span>{item.name}</span>
                  </div>

                  {/* Price */}
                  <div>₹{item.sellingPrice}</div>

                  {/* Quantity */}
                  <div className="qty">
                    <button onClick={() => decreaseQty(item._id)}>
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => increaseQty(item._id)}>
                      +
                    </button>
                  </div>

                  {/* Total */}
                  <div>
                    ₹{item.sellingPrice * item.quantity}
                  </div>

                </div>
              ))
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="cart_footer">
          <h3>Total: ₹{total}</h3>
          <button onClick={handleCheckout} className="checkout">
            Checkout
          </button>
        </div>
      </div>
    </>
  );
}

export default Cart;
