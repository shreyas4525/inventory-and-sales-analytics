import React, { useEffect, useState } from "react";
import API from "../api/axios";
import Sidebar from "../components/layout/Sidebar";
import "./sales.css";

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [expanded, setExpanded] = useState(null);

  // 🔥 Date filter state
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

  // 🔥 Filter logic
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

          {/* 🔥 FILTER UI */}
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
              onClick={() => {
                setFromDate("");
                setToDate("");
              }}
            >
              Clear
            </button>
          </div>

          {/* TABLE */}
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
                      <td>
                        {new Date(sale.createdAt).toLocaleDateString()}
                      </td>

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

                    {/* 🔥 Expanded row */}
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
                                                <tr key={i}>
                                                    <td>{item.product?.name || "Product"}</td>
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

        </div>
      </div>
    </div>
  );
};

export default Sales;