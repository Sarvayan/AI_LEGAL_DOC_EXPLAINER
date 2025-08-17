import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Login() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const { ok, error } = await login(email, password);
    if (ok) navigate(from, { replace: true });
    else setError(error);
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
      maxWidth: 420,
      border: "1px solid #e2e8f0",
      background: "#fff",
      borderRadius: 16,
      boxShadow: "0 1px 0 rgba(15,23,42,0.02), 0 6px 18px rgba(15,23,42,0.08)",
      padding: 24,
    },
    headerWrap: { marginBottom: 16 },
    title: { margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: 0.2 },
    subtitle: { margin: "6px 0 0", fontSize: 13, color: "#64748b" },
    form: { display: "grid", gap: 12, marginTop: 12 },
    label: { fontSize: 13, fontWeight: 600, color: "#334155" },
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
    inputHover: {
      borderColor: "#cbd5e1",
    },
    inputFocus: {
      borderColor: "#3b82f6",
      boxShadow: "0 0 0 3px rgba(59,130,246,0.15)",
    },
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
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 12,
      fontSize: 13,
    },
    link: {
      color: "#0ea5e9",
      textDecoration: "none",
      fontWeight: 600,
    },
    linkHover: {
      textDecoration: "underline",
    },
    // Small helper container for input+label spacing
    field: { display: "grid", gap: 6 },
  };

  // Simple hover/focus handlers to enhance inline-only styling
  const enhanceInput = (style) => {
    let hovered = false;
    let focused = false;
    const getStyle = () => ({
      ...style,
      ...(hovered ? styles.inputHover : {}),
      ...(focused ? styles.inputFocus : {}),
    });
    const state = { style: getStyle() };
    const handlers = {
      onMouseEnter: () => {
        hovered = true;
        state.style = getStyle();
      },
      onMouseLeave: () => {
        hovered = false;
        state.style = getStyle();
      },
      onFocus: () => {
        focused = true;
        state.style = getStyle();
      },
      onBlur: () => {
        focused = false;
        state.style = getStyle();
      },
    };
    return { state, handlers };
  };

  const emailInput = enhanceInput(styles.input);
  const passInput = enhanceInput(styles.input);

  // Button hover
  let btnHover = false;
  const buttonStyle = () => ({
    ...styles.button,
    ...(loading ? styles.buttonDisabled : btnHover ? styles.buttonHover : {}),
  });

  // Link hover helpers
  const mkLinkHandlers = () => {
    let hover = false;
    return {
      getStyle: () => ({ ...styles.link, ...(hover ? styles.linkHover : {}) }),
      onMouseEnter: () => (hover = true),
      onMouseLeave: () => (hover = false),
    };
  };
  const createLink = mkLinkHandlers();
  const forgotLink = mkLinkHandlers();

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.headerWrap}>
          <h2 style={styles.title}>Log in</h2>
          <p style={styles.subtitle}>
            Welcome back. Please enter your details.
          </p>
        </div>

        <form onSubmit={onSubmit} style={styles.form}>
          <div style={styles.field}>
            <label htmlFor="email" style={styles.label}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={emailInput.state.style}
              {...emailInput.handlers}
            />
          </div>

          <div style={styles.field}>
            <label htmlFor="password" style={styles.label}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={passInput.state.style}
              {...passInput.handlers}
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button
            type="submit"
            disabled={loading}
            style={buttonStyle()}
            onMouseEnter={() => (btnHover = true)}
            onMouseLeave={() => (btnHover = false)}
          >
            {loading ? "…" : "Log in"}
          </button>
        </form>

        <div style={styles.footerRow}>
          <Link
            to="/signup"
            style={createLink.getStyle()}
            onMouseEnter={createLink.onMouseEnter}
            onMouseLeave={createLink.onMouseLeave}
          >
            Create account
          </Link>
          <Link
            to="/forgot-password"
            style={forgotLink.getStyle()}
            onMouseEnter={forgotLink.onMouseEnter}
            onMouseLeave={forgotLink.onMouseLeave}
          >
            Forgot password?
          </Link>
        </div>
      </div>
    </div>
  );
}
