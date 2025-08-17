import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const styles = {
    shell: {
      position: "sticky",
      top: 0,
      zIndex: 40,
      backdropFilter: "saturate(180%) blur(8px)",
      background: "rgba(255,255,255,0.85)",
      borderBottom: "1px solid #e2e8f0",
    },
    inner: {
      maxWidth: 1152,
      margin: "0 auto",
      padding: "12px 16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      fontFamily:
        "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,Apple Color Emoji,Segoe UI Emoji",
      color: "#0f172a",
    },
    left: { display: "flex", alignItems: "center", gap: 12, minWidth: 0 },
    mark: {
      height: 36,
      width: 36,
      borderRadius: 10,
      background:
        "linear-gradient(135deg, #0f172a 0%, #1f2937 60%, #111827 100%)",
      color: "#fff",
      display: "grid",
      placeItems: "center",
      fontWeight: 800,
      letterSpacing: 0.3,
      boxShadow: "0 6px 14px rgba(15,23,42,0.20)",
      userSelect: "none",
      flex: "0 0 auto",
    },
    titleWrap: { display: "grid", gap: 2, minWidth: 0 },
    title: {
      margin: 0,
      fontSize: 18,
      fontWeight: 700,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    badge: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      fontSize: 11,
      fontWeight: 700,
      color: "#0f172a",
      background: "#f1f5f9",
      border: "1px solid #e2e8f0",
      borderRadius: 999,
      padding: "3px 8px",
      lineHeight: 1,
      letterSpacing: 0.25,
    },
    right: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      flexShrink: 0,
    },
    email: {
      fontSize: 13,
      color: "#475569",
      background: "#f8fafc",
      border: "1px solid #e2e8f0",
      padding: "6px 10px",
      borderRadius: 8,
      maxWidth: 240,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    btn: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      padding: "8px 12px",
      fontSize: 14,
      fontWeight: 700,
      borderRadius: 12,
      border: "1px solid #0f172a",
      background: "#0f172a",
      color: "#fff",
      cursor: "pointer",
      transition: "transform 120ms ease, box-shadow 120ms ease",
      boxShadow: "0 6px 14px rgba(15,23,42,0.20)",
      textDecoration: "none",
    },
    btnHover: {
      transform: "translateY(-1px)",
      boxShadow: "0 10px 22px rgba(15,23,42,0.25)",
    },
    btnSecondary: {
      border: "1px solid #e2e8f0",
      background: "#ffffff",
      color: "#0f172a",
      boxShadow: "0 2px 6px rgba(15,23,42,0.06)",
    },
    linkReset: { textDecoration: "none" },
  };

  // simple inline hover states
  let loginHover = false;
  let logoutHover = false;
  const loginBtnStyle = () => ({
    ...styles.btn,
    ...(loginHover ? styles.btnHover : {}),
  });
  const logoutBtnStyle = () => ({
    ...styles.btn,
    ...styles.btnSecondary,
    ...(logoutHover ? styles.btnHover : {}),
  });

  return (
    <div style={styles.shell}>
      <div style={styles.inner}>
        {/* Left: brand */}
        <div style={styles.left}>
          <div style={styles.mark} aria-hidden>
            AI
          </div>
          <div style={styles.titleWrap}>
            <h1 style={styles.title}>AI Legal Doc Explainer</h1>
          </div>
        </div>

        {/* Right: auth actions */}
        <div style={styles.right}>
          {user ? (
            <>
              <span title={user.email} style={styles.email}>
                {user.email}
              </span>
              <button
                type="button"
                style={logoutBtnStyle()}
                onMouseEnter={() => (logoutHover = true)}
                onMouseLeave={() => (logoutHover = false)}
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
              >
                Logout
              </button>
            </>
          ) : (
            location.pathname !== "/login" && (
              <Link
                to="/login"
                style={loginBtnStyle()}
                onMouseEnter={() => (loginHover = true)}
                onMouseLeave={() => (loginHover = false)}
              >
                Login
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  );
}
