import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import "./Signup.css";
import AuthNavbar from "../../components/layout/AuthNavbar.jsx";

function Signup() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ email: "", password: "", otp: "" });
  const [strength, setStrength] = useState({ width: 0, color: "", text: "At least 8 characters" });
  const [otpReady, setOtpReady] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [slideDir, setSlideDir] = useState("forward");
  const [showPass, setShowPass] = useState(false);
  const stepRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "password") checkStrength(value);
    if (name === "otp") setOtpReady(value.length === 6);
  };

  const checkStrength = (v) => {
    if (!v) return setStrength({ width: 0, color: "", text: "At least 8 characters" });
    if (v.length < 6) return setStrength({ width: 20, color: "#e05252", text: "Too short" });
    if (v.length < 8) return setStrength({ width: 45, color: "#e08a52", text: "Almost there" });
    if (v.length >= 12 && /[^a-zA-Z0-9]/.test(v))
      return setStrength({ width: 100, color: "#4ca97a", text: "Strong password" });
    if (v.length < 12 && !/[^a-zA-Z0-9]/.test(v))
      return setStrength({ width: 65, color: "#e0c452", text: "Fair — try adding symbols" });
    return setStrength({ width: 80, color: "#4f8ef7", text: "Good password" });
  };

  const goToStep = (next) => {
    setSlideDir(next > step ? "forward" : "back");
    setTransitioning(true);
    setTimeout(() => {
      setStep(next);
      setTransitioning(false);
    }, 220);
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/signup", { email: form.email, password: form.password });
      goToStep(2);
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

  const slideClass = transitioning
    ? slideDir === "forward" ? "auth_slide_out" : "auth_slide_out_back"
    : slideDir === "forward" ? "auth_slide_in" : "auth_slide_in_back";

  return (
    <>
      <AuthNavbar />
      <div className="auth_wrapper">

        {/* ── Left: Form panel ── */}
        <div className="auth_form_panel">
          <div className="auth_inner">

            {/* Logo */}
            <div className="auth_logo">
              <i className="fa-solid fa-box-open" />
            </div>

            {/* Step progress */}
            <div className="auth_step_tabs">
              <div className={`auth_step_dot ${step === 1 ? "active" : "done"}`} />
              <div className={`auth_step_dot ${step === 2 ? "active" : ""}`} />
            </div>

            {/* Steps */}
            <div ref={stepRef} className={`auth_step_wrapper ${slideClass}`}>

              {step === 1 && (
                <>
                  <div className="auth_form_header">
                    <h2>Create account</h2>
                    <p>Get started — it only takes a minute</p>
                  </div>

                  <form onSubmit={handleSendOTP} className="auth_form">
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
                      <label>Password</label>
                      <div className="auth_input_wrap">
                        <i className="fa-solid fa-lock auth_input_icon" />
                        <input
                          type={showPass ? "text" : "password"}
                          name="password"
                          placeholder="Min. 8 characters"
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
                      <div className="auth_strength_bar">
                        <div
                          className="auth_strength_fill"
                          style={{ width: `${strength.width}%`, background: strength.color }}
                        />
                      </div>
                      <span className="auth_hint" style={{ color: strength.color || "#5c5c70" }}>
                        {strength.text}
                      </span>
                    </div>

                    <div className="auth_field_anim" style={{ "--delay": "0.18s" }}>
                      <button type="submit" className="auth_primary_btn">
                        Send OTP <i className="fa-solid fa-arrow-right auth_arr" />
                      </button>
                    </div>

                    <hr className="auth_div auth_field_anim" style={{ "--delay": "0.22s" }} />

                    <p className="auth_switch auth_field_anim" style={{ "--delay": "0.26s" }}>
                      Already have an account? <Link to="/">Log in</Link>
                    </p>
                  </form>
                </>
              )}

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
                    <p>We sent a 6-digit code to <strong>{form.email}</strong></p>
                  </div>

                  <form onSubmit={handleVerifyOTP} className="auth_form">
                    <div className="auth_field auth_field_anim" style={{ "--delay": "0.05s" }}>
                      <label>One-time password</label>
                      <div className="auth_input_wrap">
                        <i className="fa-solid fa-key auth_input_icon" />
                        <input
                          type="text"
                          name="otp"
                          placeholder="— — — — — —"
                          maxLength={6}
                          value={form.otp}
                          onChange={handleChange}
                          className="auth_otp_input"
                          required
                        />
                      </div>
                    </div>

                    <div className="auth_field_anim" style={{ "--delay": "0.12s" }}>
                      <button
                        type="submit"
                        className="auth_primary_btn"
                        disabled={!otpReady}
                        style={{ opacity: otpReady ? 1 : 0.5, pointerEvents: otpReady ? "auto" : "none" }}
                      >
                        Verify &amp; Continue <i className="fa-solid fa-arrow-right auth_arr" />
                      </button>
                    </div>

                    <div className="auth_field_anim" style={{ "--delay": "0.18s" }}>
                      <button type="button" className="auth_ghost_btn" onClick={() => goToStep(1)}>
                        <i className="fa-solid fa-arrow-left auth_arr_l" /> Back
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── Right: Visual panel ── */}
        <div className="auth_visual_panel">
          <div className="auth_visual_noise" />

          {/* Animated orbs */}
          <div className="auth_orb auth_orb_1" />
          <div className="auth_orb auth_orb_2" />
          <div className="auth_orb auth_orb_3" />

          {/* Floating grid lines */}
          <div className="auth_grid_lines" />

          {/* Content */}
          <div className="auth_visual_content">

            <h3 className="auth_visual_headline">
              Manage smarter.<br />
              Grow faster.
            </h3>

            <p className="auth_visual_sub">
              One workspace for your entire business — manage inventory, track sales, and gain powerful insights, all in one place.
            </p>
            {/* Feature list */}
            <div className="auth_feature_list">
              {[
                { icon: "fa-bolt", label: "Organize and monitor your stock" },
                { icon: "fa-boxes-stacked", label: "Get real-time sales insights" },
                { icon: "fa-users", label: "Secure login for your business data" },
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

export default Signup;