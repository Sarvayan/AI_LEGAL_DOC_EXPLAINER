import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

export default function DocumentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doc, setDoc] = useState(null);
  const [question, setQuestion] = useState("");
  const [asking, setAsking] = useState(false);

  const load = async () => {
    const { data } = await api.get(`/api/documents/${id}`);
    setDoc(data);
  };

  useEffect(() => {
    load();
  }, [id]);

  useEffect(() => {
    if (!doc?.ai) return;

    const allFetched = ["summary", "risks", "clauses"].every((k) => doc.ai[k]);
    if (allFetched) return;

    let cancelled = false;

    const fetchAI = async () => {
      const newAi = { ...doc.ai };
      let updated = false;

      for (let kind of ["summary", "risks", "clauses"]) {
        if (!newAi[kind]) {
          try {
            const { data } = await api.get(`/api/documents/ai/${kind}/${id}`);
            if (data[kind]) {
              newAi[kind] = data[kind];
              updated = true;
            }
          } catch (err) {
            console.error(`Failed to fetch ${kind}:`, err);
          }
        }
      }

      if (!cancelled && updated) setDoc((prev) => ({ ...prev, ai: newAi }));
    };

    const interval = setInterval(fetchAI, 2000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [doc?.ai, id]);

  const ensureAI = async (kind) => {
    if (!doc) return;
    if (doc.ai?.[kind]) return;
    const { data } = await api.post(`/api/ai/${kind}`, { documentId: id });
    setDoc((prev) => ({
      ...prev,
      ai: { ...(prev.ai || {}), [kind]: data[kind] },
    }));
  };

  const ask = async (e) => {
    e.preventDefault();
    setAsking(true);
    try {
      const { data } = await api.post("/api/ai/qa", {
        documentId: id,
        question,
      });
      setDoc((prev) => ({
        ...prev,
        qa: [
          ...(prev.qa || []),
          {
            question,
            answer: data.answer,
            confidence: data.confidence,
            createdAt: new Date().toISOString(),
          },
        ],
      }));
      setQuestion("");
    } finally {
      setAsking(false);
    }
  };

  const styles = {
    page: {
      minHeight: "100vh",
      background:
        "radial-gradient(1200px 600px at 20% -10%, #e6f0ff 0%, rgba(255,255,255,0) 60%), radial-gradient(1000px 500px at 110% 10%, #f3e8ff 0%, rgba(255,255,255,0) 55%), linear-gradient(to bottom, #f8fafc 0%, #ffffff 60%)",
      padding: "24px 16px 48px",
      fontFamily:
        "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,Apple Color Emoji,Segoe UI Emoji",
      color: "#0f172a",
    },
    shell: {
      maxWidth: 1152,
      margin: "0 auto",
      display: "grid",
      gap: 16,
    },
    card: {
      background: "#fff",
      border: "1px solid #e2e8f0",
      borderRadius: 16,
      boxShadow: "0 1px 0 rgba(15,23,42,0.02), 0 6px 18px rgba(15,23,42,0.08)",
      padding: 20,
    },
    headerRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      flexWrap: "wrap",
      marginBottom: 8,
    },
    title: {
      margin: 0,
      fontSize: 22,
      fontWeight: 800,
      letterSpacing: 0.2,
      color: "#0f172a",
    },
    meta: {
      fontSize: 12,
      color: "#64748b",
      background: "#f8fafc",
      border: "1px solid #e2e8f0",
      padding: "6px 10px",
      borderRadius: 999,
      whiteSpace: "nowrap",
    },
    backBtn: {
      padding: "6px 12px",
      borderRadius: 8,
      border: "1px solid #e2e8f0",
      background: "#f1f5f9",
      color: "#0f172a",
      fontSize: 14,
      fontWeight: 600,
      cursor: "pointer",
      transition: "background 120ms ease",
    },
    backBtnHover: {
      background: "#e2e8f0",
    },
    // ... (rest of styles remain unchanged)
    grid2: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: 16,
      marginTop: 8,
    },
    panel: {
      background: "#ffffff",
      border: "1px solid #e2e8f0",
      borderRadius: 14,
      padding: 16,
      boxShadow: "0 1px 0 rgba(15,23,42,0.02), 0 1px 3px rgba(15,23,42,0.04)",
    },
    panelHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    panelTitle: {
      margin: 0,
      fontSize: 16,
      fontWeight: 800,
      color: "#0f172a",
    },
    divider: {
      height: 1,
      background: "#e2e8f0",
      border: "none",
      margin: "8px 0 12px",
    },
    helper: { fontSize: 12, color: "#64748b", marginBottom: 8 },
    list: { display: "grid", gap: 8, paddingLeft: 18 },
    li: (color) => ({
      color,
      listStyle: "disc",
      marginLeft: 12,
      fontSize: 14.5,
      lineHeight: 1.5,
    }),
    paragraph: { margin: "6px 0", fontSize: 14.5, color: "#0f172a" },
    loaderWrap: {
      display: "grid",
      placeItems: "center",
      gap: 10,
      padding: 24,
    },
    spinner: (size = 22, border = 3) => ({
      width: size,
      height: size,
      borderRadius: "50%",
      border: `${border}px solid rgba(15,23,42,0.15)`,
      borderTopColor: "#3b82f6",
      animation: "spin 0.9s linear infinite",
    }),
    loaderText: { fontSize: 14, color: "#334155" },
    qaCard: {
      background: "#ffffff",
      borderRadius: 14,
      border: "1px solid #e2e8f0",
      boxShadow: "0 1px 0 rgba(15,23,42,0.02), 0 1px 3px rgba(15,23,42,0.04)",
      padding: 20,
    },
    qaTitle: { margin: 0, fontSize: 18, fontWeight: 800, color: "#0f172a" },
    qaForm: { display: "flex", gap: 8, marginTop: 12, marginBottom: 12 },
    qaInput: {
      flex: 1,
      padding: "10px 14px",
      border: "1px solid #e2e8f0",
      borderRadius: 10,
      fontSize: 14,
      outline: "none",
      transition: "box-shadow 120ms ease, border-color 120ms ease",
    },
    qaInputFocus: {
      borderColor: "#3b82f6",
      boxShadow: "0 0 0 3px rgba(59,130,246,0.15)",
    },
    qaButton: (disabled) => ({
      padding: "10px 18px",
      borderRadius: 10,
      border: "1px solid " + (disabled ? "#e2e8f0" : "#0f172a"),
      background: disabled ? "#e2e8f0" : "#0f172a",
      color: disabled ? "#64748b" : "#ffffff",
      fontWeight: 800,
      cursor: disabled ? "not-allowed" : "pointer",
      transition: "transform 120ms ease, box-shadow 120ms ease",
      boxShadow: disabled
        ? "0 2px 6px rgba(15,23,42,0.06)"
        : "0 6px 16px rgba(15,23,42,0.18)",
    }),
    qaListWrap: { marginTop: 8, display: "grid", gap: 12 },
    qaItem: {
      background: "#f8fafc",
      borderRadius: 10,
      padding: 16,
      border: "1px solid #e2e8f0",
    },
    qaMeta: {
      fontSize: 12,
      color: "#64748b",
      marginBottom: 8,
      display: "flex",
      alignItems: "center",
      gap: 8,
      flexWrap: "wrap",
    },
    chip: (bg, color, border) => ({
      background: bg,
      color,
      border: `1px solid ${border}`,
      borderRadius: 999,
      padding: "2px 8px",
      fontSize: 12,
      fontWeight: 700,
      lineHeight: 1,
    }),
    qaQ: { marginBottom: 8, color: "#0f172a" },
    qaQMark: { fontWeight: 800, color: "#3b82f6" },
    qaA: {
      whiteSpace: "pre-wrap",
      background: "#ffffff",
      padding: 12,
      borderRadius: 8,
      borderLeft: "3px solid #3b82f6",
      color: "#334155",
    },
    keyframes: `
      @keyframes spin { to { transform: rotate(360deg); } }
    `,
  };

  const renderTextBlock = (text, bulletColor) => {
    return text
      .replace(/:\n/g, ":__INLINE__")
      .split("\n")
      .map((line, index) => {
        line = line.replace(/__INLINE__/g, "\n").trim();
        if (!line) return null;

        if (line.startsWith("- ") && !line.startsWith(":-")) {
          return (
            <li key={index} style={styles.li(bulletColor)}>
              {line.substring(2)}
            </li>
          );
        }
        return (
          <p key={index} style={styles.paragraph}>
            {line}
          </p>
        );
      });
  };

  // focus styling for ask input (inline only)
  let askFocused = false;
  const askInputStyle = {
    ...styles.qaInput,
    ...(askFocused ? styles.qaInputFocus : {}),
  };

  if (!doc)
    return (
      <div style={styles.page}>
        <div style={{ ...styles.shell }}>
          <div style={styles.card}>Loading...</div>
        </div>
      </div>
    );

  return (
    <div style={styles.page}>
      <style>{styles.keyframes}</style>
      <div style={styles.shell}>
        {/* Top Card (Document header + two-column AI panels) */}
        <div style={styles.card}>
          <div style={styles.headerRow}>
            <button style={styles.backBtn} onClick={() => navigate(-1)}>
              ← Back
            </button>
            <h1 style={styles.title}>{doc.originalFileName}</h1>
            <div style={styles.meta}>
              {new Date(doc.createdAt).toLocaleString()}
            </div>
          </div>

          <div style={styles.grid2}>
            {/* Summary */}
            <section style={styles.panel}>
              <div style={styles.panelHeader}>
                <h2 style={styles.panelTitle}>Summary</h2>
              </div>
              <hr style={styles.divider} />
              <div style={styles.helper}>Plain-English overview.</div>

              {doc.ai?.summary ? (
                <div>{renderTextBlock(doc.ai.summary, "#166534")}</div>
              ) : (
                <div style={styles.loaderWrap}>
                  <span style={styles.spinner()} />
                  <div style={styles.loaderText}>Loading…</div>
                </div>
              )}
            </section>

            {/* Risks */}
            <section style={styles.panel}>
              <div style={styles.panelHeader}>
                <h2 style={styles.panelTitle}>Risks</h2>
              </div>
              <hr style={styles.divider} />
              <div style={styles.helper}>Potential red flags.</div>

              {doc.ai?.risks ? (
                <div>{renderTextBlock(doc.ai.risks, "#9a3412")}</div>
              ) : (
                <div style={styles.loaderWrap}>
                  <span style={styles.spinner()} />
                  <div style={styles.loaderText}>Loading…</div>
                </div>
              )}
            </section>
          </div>

          {/* Clauses */}
          <section style={{ ...styles.panel, marginTop: 16 }}>
            <div style={styles.panelHeader}>
              <h2 style={styles.panelTitle}>Important Clauses</h2>
            </div>
            <hr style={styles.divider} />
            {doc.ai?.clauses ? (
              <div>{renderTextBlock(doc.ai.clauses, "#1d4ed8")}</div>
            ) : (
              <div style={styles.loaderWrap}>
                <span style={styles.spinner()} />
                <div style={styles.loaderText}>Loading…</div>
              </div>
            )}
          </section>
        </div>

        {/* Q&A */}
        <div style={styles.qaCard}>
          <h3 style={styles.qaTitle}>Ask Questions</h3>

          <form onSubmit={ask} style={styles.qaForm}>
            <input
              style={askInputStyle}
              placeholder="Ask about this document…"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onFocus={() => (askFocused = true)}
              onBlur={() => (askFocused = false)}
            />
            <button
              type="submit"
              disabled={asking || !question.trim()}
              style={styles.qaButton(asking || !question.trim())}
            >
              {asking ? (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span style={styles.spinner(14, 2)} />
                  Asking…
                </span>
              ) : (
                "Ask"
              )}
            </button>
          </form>

          <div style={styles.qaListWrap}>
            {(doc.qa || []).length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: 24,
                  color: "#64748b",
                  fontSize: 14,
                }}
              >
                No questions yet. Be the first to ask!
              </div>
            ) : (
              (doc.qa || [])
                .slice()
                .reverse()
                .map((qa, idx) => (
                  <div key={idx} style={styles.qaItem}>
                    <div style={styles.qaMeta}>
                      {new Date(qa.createdAt).toLocaleString()}
                      {qa.confidence != null && (
                        <span
                          style={
                            qa.confidence > 0.8
                              ? styles.chip("#ecfdf5", "#166534", "#bbf7d0")
                              : qa.confidence > 0.5
                              ? styles.chip("#fffbeb", "#854d0e", "#fed7aa")
                              : styles.chip("#fef2f2", "#991b1b", "#fecaca")
                          }
                        >
                          {Math.round(qa.confidence * 100)}% confidence
                        </span>
                      )}
                    </div>

                    <div style={styles.qaQ}>
                      <span style={styles.qaQMark}>Q:</span> {qa.question}
                    </div>
                    <div style={styles.qaA}>
                      <span style={styles.qaQMark}>A:</span> {qa.answer}
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
