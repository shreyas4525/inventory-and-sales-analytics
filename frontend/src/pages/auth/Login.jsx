import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Signup.css";
import { useEffect } from "react";
import API from "../../api/axios";
import AuthNavbar from "../../components/layout/authNavbar";

function Login() {

  const navigate = useNavigate();
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  // ✅ Handle input change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // ✅ Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", form);

      // Store token
      localStorage.setItem("token", res.data.token);

      console.log(res.data);

      navigate("/products");

    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <>
    <AuthNavbar/>
    <div className="signup_wrapper">
      <div className="signup_page">
        {/* LEFT SIDE */}
        <div className="signup_left">

          <div className="form_container">
            <h1>Welcome Back</h1>
          <p className="subtitle">Login to continue 🚀</p>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                required
              />

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                required
              />
              <div className="forgot_row">
              <span></span>
              <a href="#">Forgot password?</a>
            </div>

              <button type="submit" className="primary_btn">
                Login
              </button>
            </form>

            <button className="google_btn">
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt=""
              />
              Continue with Google
            </button>
            <p className="login_text">
              Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="signup_right">
          <img src="/signupimg.jpg" alt="login" />
        </div>
      </div>
    </div>
    </>
  );
}

export default Login;