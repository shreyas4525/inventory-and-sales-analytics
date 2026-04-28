import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import "./Signup.css";
import AuthNavbar from "../../components/layout/authNavbar";

function Signup() {
const [step, setStep] = useState(1);

const [form, setForm] = useState({
email: "",
password: "",
otp: ""
});

useEffect(() => {
document.body.style.overflow = "hidden";
return () => {
document.body.style.overflow = "auto";
};
}, []);

const handleChange = (e) => {
setForm({ ...form, [e.target.name]: e.target.value });
};

const handleSendOTP = async (e) => {
e.preventDefault();
try {
await API.post("/auth/signup", {
email: form.email,
password: form.password
});
setStep(2);
} catch (err) {
alert(err.response?.data?.message || "Error sending OTP");
}
};

const handleVerifyOTP = async (e) => {
e.preventDefault();
try {
await API.post("/auth/verify-signup", form);
alert("Signup successful");
window.location.href = "/";
} catch (err) {
alert(err.response?.data?.message || "Invalid OTP");
}
};

return (
<> <AuthNavbar />

  <div className="signup_wrapper">
    <div className="signup_page">

      {/* LEFT SIDE */}
      <div className="signup_left">

        {/* ✅ MOVE BUBBLES HERE */}
        <div className="bubbles">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className="form_container">

          {step === 1 && (
            <form onSubmit={handleSendOTP}>
              <h1>Create an account</h1>
          <p className="subtitle">Create your account to get started 🚀</p>
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
                Send OTP
              </button>
              <p className="login_text">
            Already have an account? <Link to="/">Log in</Link>
          </p>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOTP}>
              <p className="otp_info">
                We’ve sent a code to <strong>{form.email}</strong>
              </p>

              <input
                type="text"
                name="otp"
                onChange={handleChange}
                placeholder="Enter OTP"
                required
              />

              <button type="submit" className="primary_btn">
                Verify OTP
              </button>
            </form>
          )}

        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="signup_right">
        <img src="/signupimg.jpg" alt="signup" />
      </div>

    </div>
  </div>
</>


);
}

export default Signup;
