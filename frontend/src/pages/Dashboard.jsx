import "./dashboard.css";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, AreaChart, Area
} from "recharts";

const lineData = [
  { time: "09:00", sales: 1 },
  { time: "10:00", sales: 2.5 },
  { time: "11:00", sales: 1.8 },
  { time: "12:00", sales: 3 },
  { time: "13:00", sales: 1.7 },
  { time: "14:00", sales: 3 },
  { time: "15:00", sales: 2 }
];

const barData = [
  { name: "Mon", a: 4, b: 2 },
  { name: "Tue", a: 7, b: 3 },
  { name: "Wed", a: 5, b: 2 },
  { name: "Thu", a: 2, b: 1 },
  { name: "Fri", a: 4, b: 2 },
  { name: "Sat", a: 6, b: 2 },
  { name: "Sun", a: 8, b: 3 }
];

const areaData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  value: Math.floor(Math.random() * 3000) + 1000
}));

function Dashboard() {
  return (
    <div className="dashboard">

      {/* HEADER */}
      <div className="header">
        <h2>Product Sales Dashboard</h2>

        <div className="filters">
          <select>
            <option>All time</option>
            <option>Yearly</option>
            <option>this month</option>
            <option>this week</option>
            </select>
          <select><option>Services</option></select>
          <select><option>Posts</option></select>
        </div>
      </div>

      {/* TOP GRID */}
      <div className="top_grid">

        {/* LEFT CARDS */}
        <div className="cards">
          <div className="card">
            <p>Total Revenue</p>
            <h1>$86.1</h1>
          </div>

          <div className="card">
            <p>Conversion Rate</p>
            <h1>26%</h1>
            <span className="green">↑ 8%</span>
          </div>
        </div>

        {/* LINE CHART */}
        <div className="chart_card">
          <p>Sales Over Time</p>
          <LineChart width={400} height={200} data={lineData}>
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="sales" stroke="#4ade80" />
          </LineChart>
        </div>

        {/* BAR CHART */}
        <div className="chart_card">
          <p>Avg Sales Value</p>
          <BarChart width={400} height={200} data={barData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="a" fill="#60a5fa" />
            <Bar dataKey="b" fill="#4ade80" />
          </BarChart>
        </div>

      </div>

      {/* BIG CHART */}
      <div className="bottom_chart">
        <p>Sales Conversion Rate</p>
        <AreaChart width={1000} height={250} data={areaData}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
        </AreaChart>
      </div>

    </div>
  );
}

export default Dashboard;