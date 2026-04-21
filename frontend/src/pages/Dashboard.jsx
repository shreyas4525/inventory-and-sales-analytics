import "./dashboard.css";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  BarChart, Bar, Legend, PieChart, Pie,
  CartesianGrid, ResponsiveContainer
} from "recharts";
import Sidebar from "../components/layout/Sidebar";

const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];

function Dashboard() {

  const [summary, setSummary] = useState({});
  const [yearlyData, setYearlyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [lowStock, setLowStock] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [viewType, setViewType] = useState("yearly");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 500);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // ================= USE EFFECT =================
  useEffect(() => {
    fetchSummary();
    fetchYearly();
    fetchWeekly();
    fetchCategory();
    fetchLowStock();
    fetchTopProducts();

    const handleResize = () => {
      setIsMobile(window.innerWidth < 500);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (selectedYear) {
      fetchMonthly(selectedYear);
    }
  }, [selectedYear]);

  // ================= API CALLS =================

  const chartData =
  (viewType === "weekly" ? weeklyData : yearlyData) || [];

  const fetchSummary = async () => {
    const res = await axios.get("http://localhost:5000/api/analytics/summary", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    setSummary(res.data);
  };

  const fetchYearly = async () => {
    const res = await axios.get("http://localhost:5000/api/analytics/yearly-sales", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });

    setYearlyData(res.data || []);

    if (res.data.length > 0) {
      setSelectedYear(res.data[res.data.length - 1].year);
    }
  };

  const fetchMonthly = async (year) => {
    const res = await axios.get(
      `http://localhost:5000/api/analytics/monthly-sales?year=${year}`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      }
    );

    const formatted = (res.data || []).map(item => ({
      month: months[item.month - 1],
      totalRevenue: item.totalRevenue,
      totalProfit: item.totalProfit
    }));

    setMonthlyData(formatted);
  };

  const fetchWeekly = async () => {
    const res = await axios.get("http://localhost:5000/api/analytics/weekly-sales", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });

    setWeeklyData(res.data || []);
  };

  const fetchCategory = async () => {
    const res = await axios.get("http://localhost:5000/api/analytics/profit-category", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });

    setCategoryData(res.data || []);
  };

  const fetchLowStock = async () => {
    const res = await axios.get("http://localhost:5000/api/analytics/low-stock", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });

    setLowStock(res.data || []);
  };

  const fetchTopProducts = async () => {
    const res = await axios.get("http://localhost:5000/api/analytics/top-products", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });

    setTopProducts(res.data || []);
  };

  // ================= DATA =================

  const coloredData = categoryData.map((item, index) => ({
    ...item,
    fill: COLORS[index % COLORS.length]
  }));

  // ================= UI =================

  return (
    <div className="main_layout">
      <Sidebar />

      <div className="dashboard">
        <h2 className="title">Sales Dashboard</h2>

        {/* CARDS */}
        <div className="cards">
          <div className="card blue">
            <p>Total Revenue</p>
            <h1>₹{(summary.totalRevenue || 0).toLocaleString("en-IN")}</h1>
          </div>

          <div className="card green">
            <p>Total Profit</p>
            <h1>₹{(summary.totalProfit || 0).toLocaleString("en-IN")}</h1>
          </div>

          <div className="card">
            <p>Total Products</p>
            <h1>{summary.totalProducts || 0}</h1>
          </div>

          <div className="card red">
            <p>Low Stock</p>
            <h1>{summary.lowStockProducts || 0}</h1>
          </div>
        </div>

        {/* MONTHLY CHART */}
        <div className="chart_card full_chart">
          <div className="chart_header">
            <p>Monthly Sales</p>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {yearlyData.map((item) => (
                <option key={item.year} value={item.year}>
                  {item.year}
                </option>
              ))}
            </select>
          </div>

          <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />

              <Line type="monotone" dataKey="totalRevenue" stroke="#3b82f6" />
              <Line type="monotone" dataKey="totalProfit" stroke="#22c55e" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* PIE + BAR */}
        <div className="top_grid">
          {/* PIE */}
          <div className="chart_card">
            <p className="chart_title">Profit by Category</p>

            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={coloredData}
                  dataKey="totalProfit"
                  nameKey="category"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  label
                />
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* BAR */}
          <div className="chart_card">
            <div className="chart_header">
              <p>Revenue & profit Overview</p>

              <select
                value={viewType}
                onChange={(e) => setViewType(e.target.value)}
              >
                
                <option value="yearly">Yearly</option>
                <option value="weekly">This weekly</option>
              </select>
            </div>
              
            <ResponsiveContainer width="100%" height={260}>
              {chartData.length === 0 ? (
                <div className="empty_chart">No data available 📉</div>
              ) : (
                <BarChart data={chartData} barSize={25}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey={viewType === "weekly" ? "day" : "year"} />
                  <YAxis />
                  <Tooltip />
                  <Legend />

                  <Bar dataKey="totalRevenue" fill="#3b82f6" />
                  <Bar dataKey="totalProfit" fill="#22c55e" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="bottom_grid">
          {/* TOP PRODUCTS */}
          <div className="chart_card">
            <p className="chart_title">Top Products</p>

            {topProducts.length > 0 ? (
              topProducts.map((item, index) => (
                <div key={index} className="top_product_row">
                  <div className="left">
                    <span className="rank">#{index + 1}</span>
                    <div>
                      <p className="item_name">{item.name}</p>
                      <span className="item_sub">
                        {item.totalQuantity} sold
                      </span>
                    </div>
                  </div>

                  <div className="right">
                    ₹{item.totalProfit.toLocaleString("en-IN")}
                  </div>
                </div>
              ))
            ) : (
              <p className="empty">No data available</p>
            )}
          </div>

          {/* LOW STOCK */}
          <div className="chart_card">
            <p className="chart_title">Low Stock</p>

            {lowStock.length > 0 ? (
              lowStock.map((item, index) => (
                <div key={index} className="low_stock_item">
                  <div>
                    <p className="item_name">{item.name}</p>
                    <span className="item_sub">{item.category}</span>
                  </div>

                  <span className="stock_badge">{item.stock} left</span>
                </div>
              ))
            ) : (
              <p className="empty success">All stocks are good ✅</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;