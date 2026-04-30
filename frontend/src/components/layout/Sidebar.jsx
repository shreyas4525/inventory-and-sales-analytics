import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import "./Sidebar.css";

const navItems = [
  { to: "/products",  label: "Products",  icon: "📦" },
  { to: "/sales",     label: "Sales",     icon: "🧾" },
  { to: "/dashboard", label: "Dashboard", icon: "📊" },
  { to: "/cart",      label: "Cart",      icon: "🛒" },
];

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Lock body scroll when sidebar is open on mobile
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
      {/* Hamburger */}
      <button
        className={`hamburger ${open ? "open" : ""}`}
        onClick={() => setOpen(o => !o)}
        aria-label="Toggle menu"
      >
        <span />
        <span />
        <span />
      </button>

      {/* Overlay */}
      <div
        className={`sidebar_overlay ${open ? "visible" : ""}`}
        onClick={() => setOpen(false)}
      />

      {/* Sidebar */}
      <div className={`sidebar ${open ? "open" : ""}`}>

        {/* Logo */}
        <div className="sidebar_logo">
          <Link to="/" onClick={() => setOpen(false)}>
            <img src="/logo.png" alt="Logo" />
          </Link>
          <span className="app_name">InvenTrack</span>
        </div>

        {/* Nav */}
        <ul className="menu">
          <li><span className="section_label">Menu</span></li>
          {navItems.map(({ to, label, icon }) => (
            <li key={to}>
              <Link
                to={to}
                className={location.pathname.startsWith(to) ? "active" : ""}
              >
                <span className="nav_icon">{icon}</span>
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Bottom */}
        <div className="bottom">
          <button onClick={handleLogout} className="logout_btn">
            <span>⎋</span> Logout
          </button>
        </div>

      </div>
    </>
  );
}

export default Sidebar;