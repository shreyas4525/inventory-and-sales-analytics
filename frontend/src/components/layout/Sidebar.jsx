import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="sidebar">

      {/* <h2 className="logo">MyApp</h2> */}

      <ul className="menu">
        <li>
          <Link to="/"><img className="logo "src="logo.png" alt="" /></Link>
        </li>
        <li>
          <Link to="/products">Products</Link>
        </li>
        <li>
          <Link to="/sales">Sales</Link>
        </li>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/cart">Cart</Link>
        </li>
      </ul>

      <div className="bottom">
        <button onClick={handleLogout} className="logout_btn">
          Logout
        </button>
      </div>

    </div>
  );
}

export default Sidebar;