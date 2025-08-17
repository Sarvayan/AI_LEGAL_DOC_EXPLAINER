import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/api/auth/forgot-password", { email });
      setSent(true);
    } catch (e) {
      setError(e?.response?.data?.error || "Failed to send reset email");
    }
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
    field: { display: "grid", gap: 6 },
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
    inputHover: { borderColor: "#cbd5e1" },
    inputFocus: {
      borderColor: "#3b82f6",
      boxShadow: "0 0 0 3px rgba(59,130,246,0.15)",
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
      transition: "transform 120ms ease, box-shadow 120ms ease",
      boxShadow: "0 6px 16px rgba(15,23,42,0.18)",
    },
    buttonHover: {
      transform: "translateY(-1px)",
      boxShadow: "0 10px 24px rgba(15,23,42,0.22)",
    },

    success: {
      marginTop: 4,
      padding: "10px 12px",
      fontSize: 13,
      borderRadius: 10,
      background: "#f0fdf4",
      color: "#166534",
      border: "1px solid #bbf7d0",
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

    footerRow: {
      display: "flex",
      justifyContent: "flex-start",
      marginTop: 12,
      fontSize: 13,
    },
    link: { color: "#0ea5e9", textDecoration: "none", fontWeight: 600 },
    linkHover: { textDecoration: "underline" },
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

  let btnHover = false;
  const buttonStyle = () => ({
    ...styles.button,
    ...(btnHover ? styles.buttonHover : {}),
  });

  let linkHover = false;
  const linkStyle = () => ({
    ...styles.link,
    ...(linkHover ? styles.linkHover : {}),
  });

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.headerWrap}>
          <h2 style={styles.title}>Reset your password</h2>
          <p style={styles.subtitle}>
            Enter your email and we’ll send you a reset link.
          </p>
        </div>

        {sent ? (
          <div role="status" aria-live="polite" style={styles.success}>
            If the email exists, a reset link has been sent. Please check your
            inbox.
          </div>
        ) : (
          <form onSubmit={onSubmit} style={styles.form} noValidate>
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
                style={emailInput.getStyle()}
                onMouseEnter={emailInput.onMouseEnter}
                onMouseLeave={emailInput.onMouseLeave}
                onFocus={emailInput.onFocus}
                onBlur={emailInput.onBlur}
              />
            </div>

            {error && (
              <div role="alert" aria-live="assertive" style={styles.error}>
                {error}
              </div>
            )}

            <button
              type="submit"
              style={buttonStyle()}
              onMouseEnter={() => (btnHover = true)}
              onMouseLeave={() => (btnHover = false)}
            >
              Send reset link
            </button>
          </form>
        )}

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
