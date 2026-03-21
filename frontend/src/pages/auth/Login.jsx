import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
import API from "../../api/axios";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", {
        email,
        password
      });

      // ✅ Store token
      localStorage.setItem("token", res.data.token);

      alert("Login successful");

      // ✅ Redirect to dashboard
      navigate("/dashboard");

    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login_container">
    <div className="left" style={{ padding: "40px" }}>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          required
        />

        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          required
        />

        <br /><br />

        <button type="submit">Login</button>
        <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
      </form>
    </div>
    <div className="right">
        
    </div>
    </div>
  );
}

export default Login;