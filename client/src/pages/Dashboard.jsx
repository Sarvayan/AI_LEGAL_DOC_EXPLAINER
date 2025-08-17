import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import UploadArea from "../components/UploadArea.jsx";
import DocumentCard from "../components/DocumentCard.jsx";

export default function Dashboard() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/documents");
      setDocs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onUploaded = () => load();

  const deleteDoc = async (id) => {
    if (!confirm("Delete this document? This action cannot be undone.")) return;
    await api.delete(`/api/documents/${id}`);
    load();
  };

  const styles = {
    page: {
      minHeight: "100vh",
      background:
        "linear-gradient(to bottom, rgba(248,250,252,1) 0%, rgba(255,255,255,1) 60%)",
      fontFamily:
        "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,Apple Color Emoji,Segoe UI Emoji",
      color: "#0f172a",
    },
    header: {
      position: "sticky",
      top: 0,
      zIndex: 10,
      borderBottom: "1px solid #e2e8f0",
      background: "rgba(255,255,255,0.85)",
      backdropFilter: "saturate(180%) blur(8px)",
    },
    headerInner: {
      maxWidth: 1152,
      margin: "0 auto",
      padding: "16px 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    brand: { display: "flex", alignItems: "center", gap: 12 },
    logo: {
      height: 32,
      width: 32,
      borderRadius: 8,
      background: "#0f172a",
      color: "#fff",
      display: "grid",
      placeItems: "center",
      fontWeight: 700,
      letterSpacing: 0.2,
    },
    titleWrap: { lineHeight: 1.15 },
    title: { fontSize: 20, fontWeight: 600, margin: 0 },
    subtitle: { margin: "2px 0 0 0", fontSize: 13, color: "#64748b" },
    headerActions: { display: "flex", alignItems: "center", gap: 8 },
    button: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "8px 12px",
      fontSize: 14,
      fontWeight: 600,
      color: "#1f2937",
      background: "#ffffff",
      border: "1px solid #e5e7eb",
      borderRadius: 10,
      cursor: "pointer",
      transition:
        "transform 120ms ease, background 120ms ease, box-shadow 120ms",
      boxShadow: "0 1px 1px rgba(0,0,0,0.03)",
    },
    buttonIcon: { height: 16, width: 16 },
    buttonHover: {
      background: "#f8fafc",
      transform: "translateY(-0.5px)",
      boxShadow: "0 2px 6px rgba(15,23,42,0.06)",
    },
    backBtn: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "8px 12px",
      fontSize: 14,
      fontWeight: 600,
      background: "#f1f5f9",
      border: "1px solid #e2e8f0",
      borderRadius: 10,
      cursor: "pointer",
      color: "#0f172a",
    },

    main: { maxWidth: 1152, margin: "0 auto", padding: "32px 24px" },

    panel: {
      border: "1px solid #e2e8f0",
      background: "#fff",
      borderRadius: 16,
      boxShadow: "0 1px 0 rgba(15,23,42,0.02), 0 1px 3px rgba(15,23,42,0.04)",
      overflow: "hidden",
      marginBottom: 24,
    },
    panelBody: { padding: 24 },
    panelRow: {
      display: "flex",
      flexDirection: "column",
      gap: 16,
    },
    panelRowWide: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 16,
    },
    sectionTitle: { fontSize: 18, margin: 0, fontWeight: 600 },
    sectionHelp: { marginTop: 6, fontSize: 13, color: "#64748b" },

    listHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "14px 24px",
      borderBottom: "1px solid #e2e8f0",
    },
    listHeaderTitle: { margin: 0, fontSize: 16, fontWeight: 600 },

    listBody: { borderTop: "1px solid transparent" },

    gridWrap: { padding: 16 },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: 16,
    },

    skeletonCard: {
      border: "1px solid #eef2f7",
      borderRadius: 12,
      padding: 16,
    },
    skeletonThumb: {
      height: 160,
      width: "100%",
      borderRadius: 10,
      background:
        "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 37%, #f1f5f9 63%)",
      backgroundSize: "400% 100%",
      animation: "skeleton-shimmer 1.4s ease infinite",
    },
    skeletonLine: (w) => ({
      marginTop: 12,
      height: 12,
      width: w,
      borderRadius: 6,
      background:
        "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 37%, #f1f5f9 63%)",
      backgroundSize: "400% 100%",
      animation: "skeleton-shimmer 1.4s ease infinite",
    }),

    empty: { padding: 56, textAlign: "center" },
    emptyIconWrap: {
      height: 56,
      width: 56,
      margin: "0 auto 12px",
      display: "grid",
      placeItems: "center",
      borderRadius: 999,
      border: "1px dashed #cbd5e1",
      color: "#94a3b8",
    },
    emptyTitle: { margin: 0, fontSize: 14, fontWeight: 600 },
    emptyText: { marginTop: 6, fontSize: 13, color: "#64748b" },

    keyframes: `
      @keyframes skeleton-shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `,
  };

  const withHover = (base, hover) => {
    const [state, setState] = useState(false);
    return {
      style: state ? { ...base, ...hover } : base,
      onMouseEnter: () => setState(true),
      onMouseLeave: () => setState(false),
    };
  };

  function RefreshButton({ onClick }) {
    const hoverable = withHover(styles.button, styles.buttonHover);
    return (
      <button {...hoverable} onClick={onClick}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          style={styles.buttonIcon}
          aria-hidden
        >
          <path d="M12 6V3L8 7l4 4V8a4 4 0 1 1-4 4H6a6 6 0 1 0 6-6Z" />
        </svg>
        Refresh
      </button>
    );
  }

  return (
    <div style={styles.page}>
      <style>{styles.keyframes}</style>

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.brand}>
            <div style={styles.logo}>D</div>
            <div style={styles.titleWrap}>
              <h1 style={styles.title}>Document Dashboard</h1>
              <p style={styles.subtitle}>
                Upload, organize, and manage your files
              </p>
            </div>
          </div>
          <div style={styles.headerActions}>
            <button style={styles.backBtn} onClick={() => navigate(-1)}>
              ← Back
            </button>
            <RefreshButton onClick={load} />
          </div>
        </div>
      </header>

      {/* Content */}
      <main style={styles.main}>
        {/* Upload panel */}
        <section style={styles.panel}>
          <div style={styles.panelBody}>
            <div
              style={
                typeof window !== "undefined" && window.innerWidth >= 768
                  ? styles.panelRowWide
                  : styles.panelRow
              }
            >
              <div>
                <h2 style={styles.sectionTitle}>Add documents</h2>
                <p style={styles.sectionHelp}>
                  Drop PDFs here or click to browse. Supported: PDF.
                </p>
              </div>
              <div style={{ minWidth: 320, maxWidth: 420 }}>
                <UploadArea onUploaded={onUploaded} />
              </div>
            </div>
          </div>
        </section>

        {/* Documents list */}
        <section style={styles.panel}>
          <div style={styles.listHeader}>
            <h3 style={styles.listHeaderTitle}>Your documents</h3>
            <div>{/* reserved for future filters/search */}</div>
          </div>

          <div style={styles.listBody}>
            {loading ? (
              <div style={{ padding: 24 }}>
                <div style={styles.grid}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} style={styles.skeletonCard}>
                      <div style={styles.skeletonThumb} />
                      <div style={styles.skeletonLine("66%")} />
                      <div style={styles.skeletonLine("48%")} />
                    </div>
                  ))}
                </div>
              </div>
            ) : docs.length === 0 ? (
              <div style={styles.empty}>
                <div style={styles.emptyIconWrap} aria-hidden>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ height: 24, width: 24 }}
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <h4 style={styles.emptyTitle}>No documents yet</h4>
                <p style={styles.emptyText}>Upload a PDF to get started.</p>
              </div>
            ) : (
              <div style={styles.gridWrap}>
                <div style={styles.grid}>
                  {docs.map((d) => (
                    <div
                      key={d.id}
                      style={{
                        border: "1px solid #e2e8f0",
                        borderRadius: 12,
                        padding: 16,
                        transition: "transform 120ms ease, box-shadow 120ms",
                        boxShadow:
                          "0 1px 0 rgba(15,23,42,0.02), 0 1px 3px rgba(15,23,42,0.04)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow =
                          "0 6px 18px rgba(15,23,42,0.08)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "none";
                        e.currentTarget.style.boxShadow =
                          "0 1px 0 rgba(15,23,42,0.02), 0 1px 3px rgba(15,23,42,0.04)";
                      }}
                    >
                      <DocumentCard doc={d} onDelete={deleteDoc} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
