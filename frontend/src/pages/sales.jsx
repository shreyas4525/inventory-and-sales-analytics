import React, { useEffect, useState } from "react";
import API from "../api/axios";
import Sidebar from "../components/layout/Sidebar";
import "./sales.css";

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [expanded, setExpanded] = useState(null);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const res = await API.get("/sales");
      setSales(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this sale?")) return;
    try {
      await API.delete(`/sales/${id}`);
      setSales((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  const filteredSales = sales.filter((sale) => {
    if (!fromDate && !toDate) return true;
    const saleDate = new Date(sale.createdAt);
    if (fromDate && saleDate < new Date(fromDate)) return false;
    if (toDate && saleDate > new Date(toDate)) return false;
    return true;
  });

  return (
    <div className="layout">
      <Sidebar />

      <div className="main_content">
        <div className="sales_page">
          <h2>Sales</h2>

          {/* Filters */}
          <div className="filters">
            <div className="filter_group">
              <label>From Date</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className="filter_group">
              <label>To Date</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
            <button
              className="clear_btn"
              onClick={() => { setFromDate(""); setToDate(""); }}
            >
              Clear
            </button>
          </div>

          {/* Desktop Table */}
          <div className="table_container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total Bill</th>
                  <th>Profit</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map((sale) => (
                  <React.Fragment key={sale._id}>
                    <tr>
                      <td>{new Date(sale.createdAt).toLocaleDateString()}</td>
                      <td>{sale.items.length}</td>
                      <td>₹{sale.totalBill}</td>
                      <td style={{ color: "#16a34a", fontWeight: "500" }}>
                        ₹{sale.totalProfit}
                      </td>
                      <td className="actions_btn">
                        <button onClick={() => toggleExpand(sale._id)}>
                          <i className="fa-solid fa-eye"></i>
                        </button>
                        <button onClick={() => handleDelete(sale._id)}>
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </td>
                    </tr>

                    {expanded === sale._id && (
                      <tr className="expanded_row">
                        <td colSpan="5">
                          <table className="inner_table">
                            <thead>
                              <tr>
                                <th style={{ width: "40%" }}>Product</th>
                                <th>Qty</th>
                                <th>Amount</th>
                                <th>Profit</th>
                              </tr>
                            </thead>
                            <tbody>
                              {sale.items.map((item, i) => (
                                <tr key={i} className="expanded_items">
                                  <td>{item.product?.name}</td>
                                  <td>{item.quantity}</td>
                                  <td>₹{item.totalAmount}</td>
                                  <td className="profit">₹{item.profit}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="mobile_cards">
            {filteredSales.map((sale) => (
              <div className="product_card" key={sale._id}>

                {/* Top row — date + profit badge */}
                <div className="product_card_top">
                  <div>
                    <div className="product_card_name">
                      {new Date(sale.createdAt).toLocaleDateString()}
                    </div>
                    <div className="product_card_category">
                      {sale.items.length} item{sale.items.length !== 1 ? "s" : ""}
                    </div>
                  </div>
                  <div className="product_card_meta">
                    <span className="status active">
                      ₹{sale.totalProfit} profit
                    </span>
                  </div>
                </div>

                {/* Stats grid */}
                <div className="product_card_grid">
                  <div className="product_card_field">
                    <span className="field_label">Total Bill</span>
                    <span className="field_value">₹{sale.totalBill}</span>
                  </div>
                  <div className="product_card_field">
                    <span className="field_label">Profit</span>
                    <span className="field_value" style={{ color: "#34d17a" }}>
                      ₹{sale.totalProfit}
                    </span>
                  </div>
                </div>

                {/* Expanded items */}
                {expanded === sale._id && (
                  <div style={{ marginBottom: "12px" }}>
                    {sale.items.map((item, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "8px 0",
                          borderBottom: "1px solid rgba(255,255,255,0.06)",
                          fontSize: "13px",
                          color: "#eeeef0",
                        }}
                      >
                        <span style={{ flex: 2 }}>{item.product?.name}</span>
                        <span style={{ flex: 1, color: "#9a9aaa" }}>×{item.quantity}</span>
                        <span style={{ flex: 1, color: "#9a9aaa" }}>₹{item.totalAmount}</span>
                        <span style={{ flex: 1, color: "#34d17a" }}>₹{item.profit}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Footer — action buttons */}
                <div className="product_card_footer">
                  <div className="actions_btns_sales">
                    <button
                      className="edit"
                      onClick={() => toggleExpand(sale._id)}
                    >
                      <i
                        className="fa-solid fa-eye"
                        style={{ color: expanded === sale._id ? "rgb(34,248,91)" : "rgb(51,67,248)" }}
                      ></i>
                    </button>
                    <button
                      className="delete"
                      onClick={() => handleDelete(sale._id)}
                    >
                      <i className="fa-solid fa-trash-can" style={{ color: "rgb(254,31,31)" }}></i>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Sales;