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

      console.log(res.data);
      

    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login_container">
    <div className="left" style={{ padding: "40px" }}>
      <img src="/user.png" alt="user illasturation" />
      <br />
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
        <p className="auth-text">
          Don't have an account? 
          <Link to="/register" className="auth-link"> Register</Link>
        </p>
      </form>
    </div>
    <div className="right">
        <img src="/loginimg.png" alt="" />
    </div>
    </div>
  );
}

export default Login;