import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Signup.css";
import API from "../../api/axios";
import AuthNavbar from "../../components/layout/authNavbar";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  // forgot password states
  const [forgotMode, setForgotMode] = useState(false);
  const [step, setStep] = useState(1);

  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      navigate("/products");

    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <>
      <AuthNavbar />

      <div className="signup_wrapper">
        <div className="signup_page">
          {/* LEFT */}
          {/* LEFT */}
          <div className="signup_left">
            {/* BACK BUTTON (ONLY FOR FORGOT MODE) */}
            {forgotMode && (
              <button
                className="back_btn"
                onClick={() => {
                  setForgotMode(false);
                  setStep(1);
                }}
              >
                <i className="fa-solid fa-angle-left"></i>
              </button>
            )}

            <div className="form_container">
              {/* ================= LOGIN ================= */}
              {!forgotMode && (
                <form onSubmit={handleSubmit}>
                  <h1>Welcome Back</h1>
                  <p className="subtitle">Login to continue 🚀</p>

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
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setForgotMode(true);
                        setStep(1);
                      }}
                    >
                      Forgot password?
                    </a>
                  </div>

                  <button className="primary_btn" type="submit">
                    Login
                  </button>

                  <button className="google_btn">
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" />
                    Continue with Google
                  </button>

                  <p className="login_text">
                    Don't have an account? <Link to="/signup">Sign up</Link>
                  </p>
                </form>
              )}

              {/* ================= FORGOT PASSWORD ================= */}
              {forgotMode && (
                <div className="forget_container">
                  {/* STEP 1 */}
                  {step === 1 && (
                    <>
                      <h1>Forgot Password?</h1>
                      <p className="subtitle">
                        Don't worry, enter your registered email 🚀
                      </p>

                      <input
                        placeholder="Enter email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                      />

                      <button
                        className="forget_btn"
                        onClick={async () => {
                          await API.post("/auth/forgot-password", {
                            email: forgotEmail,
                          });

                          setStep(2);
                        }}
                      >
                        Send OTP
                      </button>
                    </>
                  )}

                  {/* STEP 2 */}
                  {step === 2 && (
                    <>
                      <h1>Enter OTP</h1>
                      <p className="subtitle">Check your email 🚀</p>

                      <input
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                      />

                      <button
                        className="forget_btn"
                        onClick={async () => {
                          setStep(3);
                        }}
                      >
                        Verify OTP
                      </button>
                    </>
                  )}

                  {/* STEP 3 */}
                  {step === 3 && (
                    <>
                      <h1>New Password</h1>
                      <p className="subtitle">Create a strong password 🚀</p>

                      <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />

                      <button
                        className="forget_btn"
                        onClick={async () => {
                          try {
                            await API.post("/auth/reset-password", {
                              email: forgotEmail,
                              otp:otp,
                              password: newPassword,
                            });

                            setForgotMode(false);
                            setStep(1);
                            setForgotEmail("");
                            setOtp("");
                            setNewPassword("");
                          } catch (err) {
                            alert(
                              err.response?.data?.message || "Reset failed"
                            );
                          }
                        }}
                      >
                        Reset Password
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="signup_right">
            <img src="/signupimg.jpg" alt="login" />
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;