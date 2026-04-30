import "./Dashboard.css";
import { useEffect, useState } from "react";
import API from "../api/axios";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  BarChart, Bar, Legend, PieChart, Pie, Cell,
  CartesianGrid, ResponsiveContainer
} from "recharts";
import Sidebar from "../components/layout/Sidebar";

const COLORS = ["#4f8ef7", "#34d17a", "#f5a623", "#f05252", "#a78bfa"];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "#1c1f2b",
        border: "1px solid rgba(255,255,255,0.09)",
        borderRadius: "10px",
        padding: "10px 14px",
        fontSize: "12.5px",
        color: "#eeeef0",
        boxShadow: "0 8px 24px rgba(0,0,0,0.4)"
      }}>
        <p style={{ color: "#9a9aaa", marginBottom: 6, fontFamily: "DM Sans" }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color, fontFamily: "DM Mono", margin: "3px 0" }}>
            {p.name}: ₹{Number(p.value).toLocaleString("en-IN")}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

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

  useEffect(() => {
    fetchSummary();
    fetchYearly();
    fetchWeekly();
    fetchCategory();
    fetchLowStock();
    fetchTopProducts();

    const handleResize = () => setIsMobile(window.innerWidth < 500);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (selectedYear) fetchMonthly(selectedYear);
  }, [selectedYear]);

  const chartData = (viewType === "weekly" ? weeklyData : yearlyData) || [];

  const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

  const fetchSummary = async () => {
    const res = await API.get("/analytics/summary", { headers: authHeader() });
    setSummary(res.data);
  };

  const fetchYearly = async () => {
    const res = await API.get("/analytics/yearly-sales", { headers: authHeader() });
    setYearlyData(res.data || []);
    if (res.data.length > 0) setSelectedYear(res.data[res.data.length - 1].year);
  };

  const fetchMonthly = async (year) => {
    const res = await API.get(`/analytics/monthly-sales?year=${year}`, { headers: authHeader() });
    const formatted = (res.data || []).map(item => ({
      month: months[item.month - 1],
      totalRevenue: item.totalRevenue,
      totalProfit: item.totalProfit
    }));
    setMonthlyData(formatted);
  };

  const fetchWeekly = async () => {
    const res = await API.get("/analytics/weekly-sales", { headers: authHeader() });
    setWeeklyData(res.data || []);
  };

  const fetchCategory = async () => {
    const res = await API.get("/analytics/profit-category", { headers: authHeader() });
    setCategoryData(res.data || []);
  };

  const fetchLowStock = async () => {
    const res = await API.get("/analytics/low-stock", { headers: authHeader() });
    setLowStock(res.data || []);
  };

  const fetchTopProducts = async () => {
    const res = await API.get("/analytics/top-products", { headers: authHeader() });
    setTopProducts(res.data || []);
  };

  const axisStyle = { fill: "#5c5c70", fontSize: 11.5, fontFamily: "DM Sans" };

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
            <span className="card_icon">💰</span>
          </div>

          <div className="card green">
            <p>Total Profit</p>
            <h1>₹{(summary.totalProfit || 0).toLocaleString("en-IN")}</h1>
            <span className="card_icon">📈</span>
          </div>

          <div className="card amber">
            <p>Total Products</p>
            <h1>{summary.totalProducts || 0}</h1>
            <span className="card_icon">📦</span>
          </div>

          <div className="card red">
            <p>Low Stock</p>
            <h1>{summary.lowStockProducts || 0}</h1>
            <span className="card_icon">⚠️</span>
          </div>
        </div>

        {/* MONTHLY CHART */}
        <div className="chart_card full_chart">
          <div className="chart_header">
            <p>Monthly Sales</p>
            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
              {yearlyData.map((item) => (
                <option key={item.year} value={item.year}>{item.year}</option>
              ))}
            </select>
          </div>

          <ResponsiveContainer width="100%" height={isMobile ? 220 : 280}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={axisStyle} axisLine={false} tickLine={false} />
              <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={55} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, fontFamily: "DM Sans", color: "#9a9aaa" }} />
              <Line type="monotone" dataKey="totalRevenue" stroke="#4f8ef7" strokeWidth={2.5} dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
              <Line type="monotone" dataKey="totalProfit" stroke="#34d17a" strokeWidth={2.5} dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* PIE + BAR */}
        <div className="top_grid">
          <div className="chart_card">
            <p className="chart_title">Profit by Category</p>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="totalProfit"
                  nameKey="category"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={4}
                  stroke="none"
                >
                  {categoryData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} opacity={0.9} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, fontFamily: "DM Sans", color: "#9a9aaa" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart_card">
            <div className="chart_header">
              <p>Revenue & Profit Overview</p>
              <select value={viewType} onChange={(e) => setViewType(e.target.value)}>
                <option value="yearly">Yearly</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>

            <ResponsiveContainer width="100%" height={260}>
              {chartData.length === 0 ? (
                <div className="empty_chart">No data available 📉</div>
              ) : (
                <BarChart data={chartData} barSize={18} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey={viewType === "weekly" ? "day" : "year"} tick={axisStyle} axisLine={false} tickLine={false} />
                  <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={55} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12, fontFamily: "DM Sans", color: "#9a9aaa" }} />
                  <Bar dataKey="totalRevenue" fill="#4f8ef7" radius={[4,4,0,0]} opacity={0.9} />
                  <Bar dataKey="totalProfit" fill="#34d17a" radius={[4,4,0,0]} opacity={0.9} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="bottom_grid">
          <div className="chart_card">
            <p className="chart_title">Top Products</p>
            {topProducts.length > 0 ? (
              topProducts.map((item, index) => (
                <div key={index} className="top_product_row">
                  <div className="left">
                    <span className="rank">#{index + 1}</span>
                    <div>
                      <p className="item_name">{item.name}</p>
                      <span className="item_sub">{item.totalQuantity} sold</span>
                    </div>
                  </div>
                  <div className="right">₹{item.totalProfit.toLocaleString("en-IN")}</div>
                </div>
              ))
            ) : (
              <p className="empty">No data available</p>
            )}
          </div>

          <div className="chart_card">
            <p className="chart_title">Low Stock Alerts</p>
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