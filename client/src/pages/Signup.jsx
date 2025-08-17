import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Signup() {
  const { signup, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Track field interaction so we don't show errors too early
  const [touched, setTouched] = useState({
    email: false,
    password: false,
    confirmPassword: false,
  });

  // Server-side error (e.g., email already in use)
  const [serverError, setServerError] = useState("");

  const emailError = useMemo(() => {
    if (!email) return "Email is required.";
    // Basic but practical email pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailPattern.test(email) ? "" : "Enter a valid email address.";
  }, [email]);

  const passwordError = useMemo(() => {
    if (!password) return "Password is required.";
    // 8+ chars, at least one upper, lower, number, special
    const strongPw = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    return strongPw.test(password)
      ? ""
      : "Must be 8+ chars and include upper, lower, number, and special character.";
  }, [password]);

  const confirmPasswordError = useMemo(() => {
    if (!confirmPassword) return "Please confirm your password.";
    return confirmPassword === password ? "" : "Passwords do not match.";
  }, [confirmPassword, password]);

  const formInvalid = Boolean(
    emailError || passwordError || confirmPasswordError
  );

  const navigate = useNavigate();

  const markAllTouched = () =>
    setTouched({ email: true, password: true, confirmPassword: true });

  const onSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    // If anything invalid, surface errors and stop
    if (formInvalid) {
      markAllTouched();
      return;
    }

    const { ok, error } = await signup(email, password);
    if (ok) navigate("/dashboard");
    else setServerError(error || "Something went wrong. Please try again.");
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 420, margin: "24px auto" }}>
        <h2>Create your account</h2>

        <form onSubmit={onSubmit} className="grid" style={{ gap: 12 }}>
          {/* Email */}
          <div>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              placeholder="Email"
              required
              aria-invalid={touched.email && !!emailError}
              aria-describedby="email-error"
            />
            {touched.email && emailError && (
              <div id="email-error" className="small" style={{ color: "#c00" }}>
                {emailError}
              </div>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
              placeholder="Password"
              required
              aria-invalid={touched.password && !!passwordError}
              aria-describedby="password-help password-error"
              autoComplete="new-password"
            />
            <div id="password-help" className="small">
              Password must be 8+ chars with upper, lower, number, special char.
            </div>
            {touched.password && passwordError && (
              <div
                id="password-error"
                className="small"
                style={{ color: "#c00" }}
              >
                {passwordError}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <input
              className="input"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() =>
                setTouched((t) => ({ ...t, confirmPassword: true }))
              }
              placeholder="Confirm password"
              required
              aria-invalid={touched.confirmPassword && !!confirmPasswordError}
              aria-describedby="confirm-error"
              autoComplete="new-password"
            />
            {touched.confirmPassword && confirmPasswordError && (
              <div
                id="confirm-error"
                className="small"
                style={{ color: "#c00" }}
              >
                {confirmPasswordError}
              </div>
            )}
          </div>

          {/* Top-level/server error */}
          {serverError && (
            <div className="small" style={{ color: "#c00" }}>
              {serverError}
            </div>
          )}

          <button className="btn" disabled={loading || formInvalid}>
            {loading ? "..." : "Create account"}
          </button>
        </form>

        <div className="row" style={{ marginTop: 12 }}>
          <Link to="/login">Back to log in</Link>
        </div>
      </div>
    </div>
  );
}
