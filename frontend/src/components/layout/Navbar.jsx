import { Link, useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">

      <div className="container-fluid">

        <Link className="navbar-brand" to="/dashboard">
          InventoryApp
        </Link>

        <div className="collapse navbar-collapse">

          <ul className="navbar-nav me-auto">

            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">Dashboard</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/products">Products</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/sales">Sales</Link>
            </li>

          </ul>

          <button className="btn btn-light" onClick={handleLogout}>
            Logout
          </button>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;