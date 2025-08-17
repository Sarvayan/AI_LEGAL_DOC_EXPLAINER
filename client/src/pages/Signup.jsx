import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Signup() {
  const { signup, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [touched, setTouched] = useState({
    email: false,
    password: false,
    confirmPassword: false,
  });

  const [serverError, setServerError] = useState("");

  const emailError = useMemo(() => {
    if (!email) return "Email is required.";
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailPattern.test(email) ? "" : "Enter a valid email address.";
  }, [email]);

  const passwordError = useMemo(() => {
    if (!password) return "Password is required.";
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

    if (formInvalid) {
      markAllTouched();
      return;
    }

    const { ok, error } = await signup(email, password);
    if (ok) navigate("/dashboard");
    else setServerError(error || "Something went wrong. Please try again.");
  };

  const styles = {
    page: {
      minHeight: "100vh",
      margin: 0,
      background:
        "radial-gradient(1200px 600px at 20% -10%, #e6f0ff 0%, rgba(255,255,255,0) 60%), radial-gradient(1000px 500px at 110% 10%, #f3e8ff 0%, rgba(255,255,255,0) 55%), linear-gradient(to bottom, #f8fafc 0%, #ffffff 60%)",
      fontFamily:
        "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,Apple Color Emoji,Segoe UI Emoji",
      color: "#0f172a",
      display: "grid",
      placeItems: "center",
      padding: "32px 16px",
    },
    card: {
      width: "100%",
      maxWidth: 460,
      border: "1px solid #e2e8f0",
      background: "#fff",
      borderRadius: 16,
      boxShadow: "0 1px 0 rgba(15,23,42,0.02), 0 6px 18px rgba(15,23,42,0.08)",
      padding: 24,
    },
    headerWrap: { marginBottom: 16 },
    title: { margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: 0.2 },
    subtitle: { margin: "6px 0 0", fontSize: 13, color: "#64748b" },

    form: { display: "grid", gap: 14, marginTop: 12 },
    field: { display: "grid", gap: 6 },
    labelRow: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
    },
    label: { fontSize: 13, fontWeight: 600, color: "#334155" },
    hint: { fontSize: 12, color: "#94a3b8" },

    input: {
      width: "100%",
      padding: "10px 12px",
      fontSize: 14,
      border: "1px solid #e2e8f0",
      borderRadius: 10,
      background: "#fff",
      color: "#0f172a",
      outline: "none",
      transition: "box-shadow 120ms ease, border-color 120ms ease",
      boxShadow: "0 0 0 0 rgba(59,130,246,0)",
    },
    inputHover: { borderColor: "#cbd5e1" },
    inputFocus: {
      borderColor: "#3b82f6",
      boxShadow: "0 0 0 3px rgba(59,130,246,0.15)",
    },

    helpText: { fontSize: 12, color: "#64748b" },
    error: {
      marginTop: 4,
      padding: "10px 12px",
      fontSize: 13,
      borderRadius: 10,
      background: "#fff5f5",
      color: "#b42318",
      border: "1px solid #fecaca",
    },

    button: {
      width: "100%",
      padding: "10px 12px",
      fontSize: 15,
      fontWeight: 700,
      border: "1px solid #0f172a",
      borderRadius: 12,
      background: "#0f172a",
      color: "#fff",
      cursor: "pointer",
      transition: "transform 120ms ease, box-shadow 120ms ease, opacity 120ms",
      boxShadow: "0 6px 16px rgba(15,23,42,0.18)",
    },
    buttonHover: {
      transform: "translateY(-1px)",
      boxShadow: "0 10px 24px rgba(15,23,42,0.22)",
    },
    buttonDisabled: {
      opacity: 0.7,
      cursor: "not-allowed",
      transform: "none",
      boxShadow: "0 6px 16px rgba(15,23,42,0.18)",
    },

    footerRow: {
      display: "flex",
      justifyContent: "flex-start",
      marginTop: 12,
      fontSize: 13,
    },
    link: { color: "#0ea5e9", textDecoration: "none", fontWeight: 600 },
    linkHover: { textDecoration: "underline" },

    // Tiny strength bar
    strengthWrap: { height: 6, borderRadius: 6, background: "#eef2f7" },
    strengthBar: (pct, color) => ({
      width: `${pct}%`,
      height: "100%",
      borderRadius: 6,
      background: color,
      transition: "width 160ms ease",
    }),
  };

  // Inline-only hover/focus helpers
  const enhanceInput = (base) => {
    let hovered = false;
    let focused = false;
    const style = () => ({
      ...base,
      ...(hovered ? styles.inputHover : {}),
      ...(focused ? styles.inputFocus : {}),
    });
    return {
      getStyle: style,
      onMouseEnter: () => (hovered = true),
      onMouseLeave: () => (hovered = false),
      onFocus: () => (focused = true),
      onBlur: () => (focused = false),
    };
  };

  const emailInput = enhanceInput(styles.input);
  const passInput = enhanceInput(styles.input);
  const confirmInput = enhanceInput(styles.input);

  // Button/link hover
  let btnHover = false;
  const buttonStyle = () => ({
    ...styles.button,
    ...(loading || formInvalid ? styles.buttonDisabled : {}),
    ...(!loading && !formInvalid && btnHover ? styles.buttonHover : {}),
  });

  let linkHover = false;
  const linkStyle = () => ({
    ...styles.link,
    ...(linkHover ? styles.linkHover : {}),
  });

  // Simple password strength calc (visual only)
  const strength = (() => {
    let score = 0;
    if (password.length >= 8) score += 25;
    if (/[A-Z]/.test(password)) score += 25;
    if (/[a-z]/.test(password)) score += 20;
    if (/\d/.test(password)) score += 15;
    if (/[^A-Za-z0-9]/.test(password)) score += 15;
    const pct = Math.min(100, score);
    const color =
      pct >= 80
        ? "#16a34a"
        : pct >= 60
        ? "#22c55e"
        : pct >= 40
        ? "#f59e0b"
        : "#ef4444";
    return { pct, color };
  })();

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.headerWrap}>
          <h2 style={styles.title}>Create your account</h2>
          <p style={styles.subtitle}>Start organizing your documents.</p>
        </div>

        <form onSubmit={onSubmit} style={styles.form} noValidate>
          {/* Email */}
          <div style={styles.field}>
            <div style={styles.labelRow}>
              <label htmlFor="email" style={styles.label}>
                Email
              </label>
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              placeholder="you@example.com"
              required
              aria-invalid={touched.email && !!emailError}
              aria-describedby="email-error"
              style={emailInput.getStyle()}
              onMouseEnter={emailInput.onMouseEnter}
              onMouseLeave={emailInput.onMouseLeave}
              onFocus={emailInput.onFocus}
              onBlurCapture={emailInput.onBlur}
            />
            {touched.email && emailError && (
              <div id="email-error" role="alert" style={styles.error}>
                {emailError}
              </div>
            )}
          </div>

          {/* Password */}
          <div style={styles.field}>
            <div style={styles.labelRow}>
              <label htmlFor="password" style={styles.label}>
                Password
              </label>
              <span style={styles.hint}>
                8+ chars with upper, lower, number, special
              </span>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
              placeholder="••••••••"
              required
              aria-invalid={touched.password && !!passwordError}
              aria-describedby="password-help password-error"
              autoComplete="new-password"
              style={passInput.getStyle()}
              onMouseEnter={passInput.onMouseEnter}
              onMouseLeave={passInput.onMouseLeave}
              onFocus={passInput.onFocus}
              onBlurCapture={passInput.onBlur}
            />
            <div id="password-help" style={styles.helpText}>
              Password must be 8+ chars with upper, lower, number, special char.
            </div>
            <div style={styles.strengthWrap}>
              <div style={styles.strengthBar(strength.pct, strength.color)} />
            </div>
            {touched.password && passwordError && (
              <div id="password-error" role="alert" style={styles.error}>
                {passwordError}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div style={styles.field}>
            <div style={styles.labelRow}>
              <label htmlFor="confirm" style={styles.label}>
                Confirm password
              </label>
            </div>
            <input
              id="confirm"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() =>
                setTouched((t) => ({ ...t, confirmPassword: true }))
              }
              placeholder="Repeat password"
              required
              aria-invalid={touched.confirmPassword && !!confirmPasswordError}
              aria-describedby="confirm-error"
              autoComplete="new-password"
              style={confirmInput.getStyle()}
              onMouseEnter={confirmInput.onMouseEnter}
              onMouseLeave={confirmInput.onMouseLeave}
              onFocus={confirmInput.onFocus}
              onBlurCapture={confirmInput.onBlur}
            />
            {touched.confirmPassword && confirmPasswordError && (
              <div id="confirm-error" role="alert" style={styles.error}>
                {confirmPasswordError}
              </div>
            )}
          </div>

          {/* Server error */}
          {serverError && (
            <div role="alert" style={styles.error}>
              {serverError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || formInvalid}
            style={buttonStyle()}
            onMouseEnter={() => (btnHover = true)}
            onMouseLeave={() => (btnHover = false)}
          >
            {loading ? "…" : "Create account"}
          </button>
        </form>

        <div style={styles.footerRow}>
          <Link
            to="/login"
            style={linkStyle()}
            onMouseEnter={() => (linkHover = true)}
            onMouseLeave={() => (linkHover = false)}
          >
            ← Back to log in
          </Link>
        </div>
      </div>
    </div>
  );
}
