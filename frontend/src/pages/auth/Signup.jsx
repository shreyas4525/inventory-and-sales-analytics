import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import "./signup.css";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/register", form);
      navigate("/");
      
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="signup_wrapper">
    <div className="signup_page">
      
      {/* LEFT SIDE */}
      <div className="signup_left">
        <h1>Create an account</h1>
        <div className="form_container">

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              onChange={handleChange}
              placeholder="Name"
              autoComplete="none"
              required
            />
            <input
              type="email"
              name="email"
              onChange={handleChange}
              placeholder="Email"
              required
            />

            <input
              type="password"
              name="password"
              onChange={handleChange}
              placeholder="Password"
              required
            />

            <small>Must be at least 8 characters</small>

            <button type="submit" className="primary_btn">
              Get started
            </button>
          </form>

          <button className="google_btn">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="" />
            Sign up with Google
          </button>

          <p className="login_text">
            Already have an account? <Link to="/">Log in</Link>
          </p>

        </div>
      </div>

      {/* RIGHT SIDE IMAGE */}
      <div className="signup_right">
        <img src="/signupimg.jpg" alt="signup" />
      </div>

    </div>
    </div>
  );
}

export default Signup;