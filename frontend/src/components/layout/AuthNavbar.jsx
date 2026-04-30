import "./AuthNavbar.css";

function AuthNavbar() {
  return (
    <nav className="auth_nav">
      <div className="auth_nav_inner">
        <div className="auth_nav_brand">
          <img src="logo.png" alt="Inventrack logo" className="auth_nav_logo" />
        </div>
      </div>
    </nav>
  );
}

export default AuthNavbar;