import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar_container">
      <ul>
        <li><Link to="/Products">inventory</Link></li>
        <li><Link to="/products">Products</Link></li>
        <li><Link to="/dashboard">dashboard</Link></li>
        <li onClick={handleLogout} className="logout">Logout</li>
      </ul>
    </nav>
  );
}

export default Navbar;