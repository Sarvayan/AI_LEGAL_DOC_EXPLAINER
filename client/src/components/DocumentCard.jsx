import { Link } from "react-router-dom";

export default function DocumentCard({ doc, onDelete }) {
  const styles = {
    card: {
      background: "#fff",
      borderRadius: 14,
      border: "1px solid #e2e8f0",
      padding: 16,
      boxShadow: "0 1px 0 rgba(15,23,42,0.02), 0 1px 3px rgba(15,23,42,0.04)",
      transition:
        "transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease",
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
    },
    left: { display: "flex", alignItems: "center", gap: 12, minWidth: 0 },
    icon: {
      height: 40,
      width: 40,
      flex: "0 0 auto",
      display: "grid",
      placeItems: "center",
      borderRadius: 10,
      background:
        "linear-gradient(135deg, #f8fafc 0%, #eef2f7 60%, #e2e8f0 100%)",
      color: "#0f172a",
      fontWeight: 800,
      boxShadow: "inset 0 0 0 1px #e5e7eb",
      userSelect: "none",
    },
    titleWrap: { minWidth: 0 },
    title: {
      margin: 0,
      fontSize: 15,
      fontWeight: 700,
      color: "#0f172a",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: 360,
    },
    meta: { marginTop: 4, fontSize: 12, color: "#64748b" },

    actions: { display: "flex", alignItems: "center", gap: 8, flexShrink: 0 },
    btn: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "8px 12px",
      fontSize: 13,
      fontWeight: 700,
      borderRadius: 10,
      border: "1px solid transparent",
      cursor: "pointer",
      transition:
        "transform 120ms ease, box-shadow 120ms ease, background 120ms ease, border-color 120ms ease",
      textDecoration: "none",
    },
    btnPrimary: {
      background: "#0f172a",
      color: "#fff",
      borderColor: "#0f172a",
      boxShadow: "0 6px 14px rgba(15,23,42,0.18)",
    },
    btnPrimaryHover: {
      transform: "translateY(-1px)",
      boxShadow: "0 10px 22px rgba(15,23,42,0.22)",
    },
    btnDanger: {
      background: "#fff",
      color: "#b91c1c",
      borderColor: "#fecaca",
      boxShadow: "0 2px 6px rgba(15,23,42,0.06)",
    },
    btnDangerHover: {
      background: "#fff5f5",
      borderColor: "#fca5a5",
      transform: "translateY(-1px)",
      boxShadow: "0 8px 16px rgba(185,28,28,0.12)",
    },

    badgesRow: { marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" },
    badge: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      fontSize: 12,
      fontWeight: 700,
      padding: "4px 10px",
      borderRadius: 999,
      border: "1px solid transparent",
      lineHeight: 1,
    },
    badgePositive: {
      background: "#ecfdf5",
      color: "#166534",
      borderColor: "#bbf7d0",
    },
    badgeNeutral: {
      background: "#f1f5f9",
      color: "#475569",
      borderColor: "#e2e8f0",
    },
    badgeWarn: {
      background: "#fff7ed",
      color: "#9a3412",
      borderColor: "#fed7aa",
    },
  };

  // hover effects (inline-only)
  let openHover = false;
  let delHover = false;

  return (
    <div
      style={styles.card}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 6px 18px rgba(15,23,42,0.08)";
        e.currentTarget.style.borderColor = "#dbe3ee";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow =
          "0 1px 0 rgba(15,23,42,0.02), 0 1px 3px rgba(15,23,42,0.04)";
        e.currentTarget.style.borderColor = "#e2e8f0";
      }}
    >
      <div style={styles.header}>
        <div style={styles.left}>
          <div style={styles.icon} aria-hidden>
            {String(doc.originalFileName || "D")
              .slice(0, 1)
              .toUpperCase()}
          </div>
          <div style={styles.titleWrap}>
            <h3 title={doc.originalFileName} style={styles.title}>
              {doc.originalFileName}
            </h3>
            <div style={styles.meta}>
              Uploaded {new Date(doc.createdAt).toLocaleString()}
            </div>
          </div>
        </div>

        <div style={styles.actions}>
          <Link
            to={`/documents/${doc.id}`}
            style={{
              ...styles.btn,
              ...styles.btnPrimary,
              ...(openHover ? styles.btnPrimaryHover : {}),
            }}
            onMouseEnter={() => (openHover = true)}
            onMouseLeave={() => (openHover = false)}
            aria-label={`Open ${doc.originalFileName}`}
          >
            Open
          </Link>
          <button
            type="button"
            onClick={() => onDelete(doc.id)}
            style={{
              ...styles.btn,
              ...styles.btnDanger,
              ...(delHover ? styles.btnDangerHover : {}),
            }}
            onMouseEnter={() => (delHover = true)}
            onMouseLeave={() => (delHover = false)}
            aria-label={`Delete ${doc.originalFileName}`}
          >
            Delete
          </button>
        </div>
      </div>

      <div style={styles.badgesRow}>
        {doc.hasSummary ? (
          <span style={{ ...styles.badge, ...styles.badgePositive }}>
            Summary ready
          </span>
        ) : (
          <span style={{ ...styles.badge, ...styles.badgeNeutral }}>
            No summary yet
          </span>
        )}

        {doc.hasRisks ? (
          <span style={{ ...styles.badge, ...styles.badgeWarn }}>
            Risks detected
          </span>
        ) : (
          <span style={{ ...styles.badge, ...styles.badgeNeutral }}>
            No risks
          </span>
        )}
      </div>
    </div>
  );
}
