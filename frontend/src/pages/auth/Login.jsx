import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Signup.css";
import API from "../../api/axios";
import AuthNavbar from "../../components/layout/AuthNavbar.jsx";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [step, setStep] = useState(1);
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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

  const exitForgot = () => { setForgotMode(false); setStep(1); };

  return (
    <>
      <AuthNavbar />
      <div className="auth_wrapper">

        {/* ── Left: Form panel ── */}
        <div className="auth_form_panel">
          <div className="auth_inner">

            <div className="auth_logo">
              <i className="fa-solid fa-box-open" />
            </div>

            {/* Login form */}
            {!forgotMode && (
              <div className="auth_slide_in">
                <div className="auth_form_header">
                  <h2>Welcome back</h2>
                  <p>Sign in to your account to continue</p>
                </div>

                <form onSubmit={handleSubmit} className="auth_form">
                  <div className="auth_field auth_field_anim" style={{ "--delay": "0.05s" }}>
                    <label>Email</label>
                    <div className="auth_input_wrap">
                      <i className="fa-solid fa-envelope auth_input_icon" />
                      <input
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="auth_field auth_field_anim" style={{ "--delay": "0.12s" }}>
                    <div className="auth_label_row">
                      <label>Password</label>
                      <a
                        href="#"
                        className="auth_forgot_link"
                        onClick={(e) => { e.preventDefault(); setForgotMode(true); setStep(1); }}
                      >
                        Forgot password?
                      </a>
                    </div>
                    <div className="auth_input_wrap">
                      <i className="fa-solid fa-lock auth_input_icon" />
                      <input
                        type={showPass ? "text" : "password"}
                        name="password"
                        placeholder="Your password"
                        value={form.password}
                        onChange={handleChange}
                        required
                      />
                      <button
                        type="button"
                        className="auth_eye_btn"
                        onClick={() => setShowPass((p) => !p)}
                        tabIndex={-1}
                      >
                        <i className={`fa-solid ${showPass ? "fa-eye-slash" : "fa-eye"}`} />
                      </button>
                    </div>
                  </div>

                  <div className="auth_field_anim" style={{ "--delay": "0.18s" }}>
                    <button type="submit" className="auth_primary_btn">
                      Login <i className="fa-solid fa-arrow-right auth_arr" />
                    </button>
                  </div>

                  <hr className="auth_div auth_field_anim" style={{ "--delay": "0.22s" }} />

                  <p className="auth_switch auth_field_anim" style={{ "--delay": "0.26s" }}>
                    Don't have an account? <Link to="/signup">Sign up</Link>
                  </p>
                </form>
              </div>
            )}

            {/* Forgot password flow */}
            {forgotMode && (
              <div className="auth_slide_in">
                {/* Step dots */}
                <div className="auth_step_tabs">
                  <div className={`auth_step_dot ${step === 1 ? "active" : "done"}`} />
                  <div className={`auth_step_dot ${step === 2 ? "active" : step > 2 ? "done" : ""}`} />
                  <div className={`auth_step_dot ${step === 3 ? "active" : ""}`} />
                </div>

                {/* Step 1 — Email */}
                {step === 1 && (
                  <>
                    <div className="auth_form_header">
                      <h2>Forgot password?</h2>
                      <p>Enter your registered email and we'll send a code</p>
                    </div>
                    <div className="auth_form">
                      <div className="auth_field auth_field_anim" style={{ "--delay": "0.05s" }}>
                        <label>Email</label>
                        <div className="auth_input_wrap">
                          <i className="fa-solid fa-envelope auth_input_icon" />
                          <input
                            type="email"
                            placeholder="you@example.com"
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="auth_field_anim" style={{ "--delay": "0.12s" }}>
                        <button
                          className="auth_primary_btn"
                          onClick={async () => {
                            await API.post("/auth/forgot-password", { email: forgotEmail });
                            setStep(2);
                          }}
                        >
                          Send OTP <i className="fa-solid fa-arrow-right auth_arr" />
                        </button>
                      </div>
                      <div className="auth_field_anim" style={{ "--delay": "0.18s" }}>
                        <button type="button" className="auth_ghost_btn" onClick={exitForgot}>
                          <i className="fa-solid fa-arrow-left auth_arr_l" /> Back to login
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Step 2 — OTP */}
                {step === 2 && (
                  <>
                    <div className="auth_otp_icon">
                      <i className="fa-solid fa-envelope-open-text" />
                    </div>
                    <div className="auth_form_header">
                      <div className="auth_badge">
                        <i className="fa-solid fa-circle-check" style={{ fontSize: 10 }} /> Code sent
                      </div>
                      <h2>Check your email</h2>
                      <p>We sent a 6-digit code to <strong>{forgotEmail}</strong></p>
                    </div>
                    <div className="auth_form">
                      <div className="auth_field auth_field_anim" style={{ "--delay": "0.05s" }}>
                        <label>One-time password</label>
                        <div className="auth_input_wrap">
                          <i className="fa-solid fa-key auth_input_icon" />
                          <input
                            type="text"
                            placeholder="— — — — — —"
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="auth_otp_input"
                          />
                        </div>
                      </div>
                      <div className="auth_field_anim" style={{ "--delay": "0.12s" }}>
                        <button
                          className="auth_primary_btn"
                          disabled={otp.length !== 6}
                          style={{ opacity: otp.length === 6 ? 1 : 0.5, pointerEvents: otp.length === 6 ? "auto" : "none" }}
                          onClick={() => setStep(3)}
                        >
                          Verify OTP <i className="fa-solid fa-arrow-right auth_arr" />
                        </button>
                      </div>
                      <div className="auth_field_anim" style={{ "--delay": "0.18s" }}>
                        <button type="button" className="auth_ghost_btn" onClick={() => setStep(1)}>
                          <i className="fa-solid fa-arrow-left auth_arr_l" /> Back
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Step 3 — New password */}
                {step === 3 && (
                  <>
                    <div className="auth_form_header">
                      <div className="auth_badge">
                        <i className="fa-solid fa-circle-check" style={{ fontSize: 10 }} /> Verified
                      </div>
                      <h2>New password</h2>
                      <p>Create a strong password for your account</p>
                    </div>
                    <div className="auth_form">
                      <div className="auth_field auth_field_anim" style={{ "--delay": "0.05s" }}>
                        <label>New password</label>
                        <div className="auth_input_wrap">
                          <i className="fa-solid fa-lock auth_input_icon" />
                          <input
                            type="password"
                            placeholder="Min. 8 characters"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="auth_field_anim" style={{ "--delay": "0.12s" }}>
                        <button
                          className="auth_primary_btn"
                          onClick={async () => {
                            try {
                              await API.post("/auth/reset-password", {
                                email: forgotEmail,
                                otp,
                                password: newPassword,
                              });
                              exitForgot();
                              setForgotEmail(""); setOtp(""); setNewPassword("");
                            } catch (err) {
                              alert(err.response?.data?.message || "Reset failed");
                            }
                          }}
                        >
                          Reset Password <i className="fa-solid fa-arrow-right auth_arr" />
                        </button>
                      </div>
                      <div className="auth_field_anim" style={{ "--delay": "0.18s" }}>
                        <button type="button" className="auth_ghost_btn" onClick={() => setStep(2)}>
                          <i className="fa-solid fa-arrow-left auth_arr_l" /> Back
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

          </div>
        </div>

        {/* ── Right: Visual panel ── */}
        <div className="auth_visual_panel">
          <div className="auth_visual_noise" />
          <div className="auth_orb auth_orb_1" />
          <div className="auth_orb auth_orb_2" />
          <div className="auth_orb auth_orb_3" />
          <div className="auth_grid_lines" />

          <div className="auth_visual_content">

            <h3 className="auth_visual_headline">
              Run your business.<br />
              Smarter and faster.
            </h3>

            <p className="auth_visual_sub">
               One platform to control inventory, analyze sales, and grow your business with confidence.
            </p>
            {/* Feature list */}
            <div className="auth_feature_list">
              {[
                { icon: "fa-bolt", label: "Lightning-fast dashboard" },
                { icon: "fa-boxes-stacked", label: "Real-time Sales Analytcs" },
                { icon: "fa-users", label: "Collaborate with your team" },
              ].map((f, i) => (
                <div
                  className="auth_feature_item"
                  key={f.label}
                  style={{ animationDelay: `${0.7 + i * 0.1}s` }}
                >
                  <div className="auth_feature_icon">
                    <i className={`fa-solid ${f.icon}`} />
                  </div>
                  <span>{f.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

export default Login;