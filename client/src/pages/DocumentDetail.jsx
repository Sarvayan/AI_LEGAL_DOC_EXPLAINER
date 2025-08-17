import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

export default function DocumentDetail() {
  const { id } = useParams();
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

  if (!doc)
    return (
      <div className="container">
        <div className="card">Loading...</div>
      </div>
    );

  return (
    <div className="container">
      <div className="card">
        <div className="row" style={{ justifyContent: "space-between" }}>
          <h1
            style={{
              color: "darkblue",
              fontSize: "26px",
              fontWeight: "bold",
              marginBottom: "12px",
              textAlign: "center",
            }}
          >
            {doc.originalFileName}
          </h1>
          <div className="small">
            {new Date(doc.createdAt).toLocaleString()}
          </div>
        </div>
        <div className="grid grid-2">
          <section>
            <h1 style={{ color: "red", fontSize: "24px", marginBottom: "1px" }}>
              Summary
            </h1>
            <hr style={{ border: "2px solid red" }} />
            <div className="small mb-2">Plain-English overview.</div>

            {doc.ai?.summary ? (
              <div className="space-y-3 leading-relaxed text-gray-800">
                {doc.ai.summary
                  // Replace newline immediately after colon with a special placeholder
                  .replace(/:\n/g, ":__INLINE__")
                  .split("\n")
                  .map((line, index) => {
                    line = line.replace(/__INLINE__/g, "\n").trim(); // restore inline colon lines
                    if (!line) return null;

                    // List item: starts with '- ' but not ':-'
                    if (line.startsWith("- ") && !line.startsWith(":-")) {
                      return (
                        <li
                          key={index}
                          className="ml-6 list-disc"
                          style={{ color: "green" }}
                        >
                          {line.substring(2)}
                        </li>
                      );
                    }

                    // Normal paragraph (even if it has colon)
                    return <h4 key={index}>{line}</h4>;
                  })}
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "20px",
                  marginTop: "80px",
                }}
              >
                <span
                  style={{
                    width: "40px",
                    height: "40px",
                    border: "3px solid rgba(0,0,0,0.2)",
                    borderTopColor: "#3b82f6",
                    borderRadius: "50%",
                    animation: "spin 2s linear infinite",
                  }}
                ></span>
                <p
                  style={{
                    marginTop: "12px",
                    fontSize: "16px",
                    color: "#334155",
                  }}
                >
                  Loading...
                </p>
              </div>
            )}
          </section>

          <section>
            <h1 style={{ color: "red", fontSize: "24px", marginBottom: "1px" }}>
              Risks
            </h1>
            <hr style={{ border: "2px solid red" }} />
            <div className="small mb-2">Potential red flags.</div>
            {doc.ai?.risks ? (
              <div className="space-y-3 leading-relaxed text-gray-800">
                {doc.ai.risks
                  .replace(/:\n/g, ":__INLINE__")
                  .split("\n")
                  .map((line, index) => {
                    line = line.replace(/__INLINE__/g, "\n").trim();
                    if (!line) return null;

                    if (line.startsWith("- ") && !line.startsWith(":-")) {
                      return (
                        <li
                          key={index}
                          className="ml-6 list-disc"
                          style={{ color: "#800000" }}
                        >
                          {line.substring(2)}
                        </li>
                      );
                    }

                    return <h4 key={index}>{line}</h4>;
                  })}
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "20px",
                  marginTop: "80px",
                }}
              >
                <span
                  style={{
                    width: "40px",
                    height: "40px",
                    border: "3px solid rgba(0,0,0,0.2)",
                    borderTopColor: "#3b82f6",
                    borderRadius: "50%",
                    animation: "spin 2s linear infinite",
                  }}
                ></span>
                <p
                  style={{
                    marginTop: "12px",
                    fontSize: "16px",
                    color: "#334155",
                  }}
                >
                  Loading...
                </p>
              </div>
            )}
          </section>
        </div>
        <section>
          <h1 style={{ color: "red", fontSize: "24px", marginBottom: "1px" }}>
            Important Clauses
          </h1>
          <hr style={{ border: "2px solid red" }} />
          {doc.ai?.clauses ? (
            <div className="space-y-3 leading-relaxed text-gray-800">
              {doc.ai.clauses
                .replace(/:\n/g, ":__INLINE__")
                .split("\n")
                .map((line, index) => {
                  line = line.replace(/__INLINE__/g, "\n").trim();
                  if (!line) return null;

                  if (line.startsWith("- ") && !line.startsWith(":-")) {
                    return (
                      <li
                        key={index}
                        className="ml-6 list-disc"
                        style={{ color: "blue" }}
                      >
                        {line.substring(2)}
                      </li>
                    );
                  }

                  return <h4 key={index}>{line}</h4>;
                })}
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "20px",
                marginTop: "80px",
              }}
            >
              <span
                style={{
                  width: "40px",
                  height: "40px",
                  border: "3px solid rgba(0,0,0,0.2)",
                  borderTopColor: "#3b82f6",
                  borderRadius: "50%",
                  animation: "spin 2s linear infinite",
                }}
              ></span>
              <p
                style={{
                  marginTop: "12px",
                  fontSize: "16px",
                  color: "#334155",
                }}
              >
                Loading...
              </p>
            </div>
          )}
        </section>
      </div>

      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          padding: "20px",
          marginBottom: "20px",
        }}
      >
        <h3
          style={{
            fontSize: "1.25rem",
            fontWeight: "600",
            color: "#1a1a1a",
            marginBottom: "16px",
          }}
        >
          Ask Questions
        </h3>

        <form
          onSubmit={ask}
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "16px",
          }}
        >
          <input
            style={{
              flex: "1",
              padding: "10px 14px",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "0.95rem",
              outline: "none",
              transition: "border-color 0.2s",
            }}
            placeholder="Ask about this document..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button
            style={{
              padding: "10px 18px",
              backgroundColor:
                asking || !question.trim() ? "#e2e8f0" : "#3b82f6",
              color: asking || !question.trim() ? "#64748b" : "#ffffff",
              border: "none",
              borderRadius: "8px",
              fontWeight: "500",
              cursor: asking || !question.trim() ? "not-allowed" : "pointer",
              transition: "background-color 0.2s",
            }}
            disabled={asking || !question.trim()}
          >
            {asking ? (
              <span style={{ display: "flex", alignItems: "center" }}>
                <span
                  style={{
                    display: "inline-block",
                    width: "14px",
                    height: "14px",
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "white",
                    borderRadius: "50%",
                    marginRight: "6px",
                    animation: "spin 1s linear infinite",
                  }}
                ></span>
                Asking...
              </span>
            ) : (
              "Ask"
            )}
          </button>
        </form>

        <div style={{ marginTop: "16px" }}>
          {(doc.qa || []).length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "24px",
                color: "#64748b",
                fontSize: "0.9rem",
              }}
            >
              No questions yet. Be the first to ask!
            </div>
          ) : (
            (doc.qa || [])
              .slice()
              .reverse()
              .map((qa, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: "#f8fafc",
                    borderRadius: "8px",
                    padding: "16px",
                    marginBottom: "12px",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "#64748b",
                      marginBottom: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    {new Date(qa.createdAt).toLocaleString()}
                    {qa.confidence != null && (
                      <span
                        style={{
                          backgroundColor:
                            qa.confidence > 0.8
                              ? "#dcfce7"
                              : qa.confidence > 0.5
                              ? "#fef08a"
                              : "#fee2e2",
                          color:
                            qa.confidence > 0.8
                              ? "#166534"
                              : qa.confidence > 0.5
                              ? "#854d0e"
                              : "#991b1b",
                          padding: "2px 8px",
                          borderRadius: "12px",
                          fontSize: "0.75rem",
                          fontWeight: "500",
                        }}
                      >
                        {Math.round(qa.confidence * 100)}% confidence
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      marginBottom: "8px",
                      color: "#1e293b",
                    }}
                  >
                    <span style={{ fontWeight: "600", color: "#3b82f6" }}>
                      Q:
                    </span>{" "}
                    {qa.question}
                  </div>
                  <div
                    style={{
                      whiteSpace: "pre-wrap",
                      backgroundColor: "#ffffff",
                      padding: "12px",
                      borderRadius: "6px",
                      borderLeft: "3px solid #3b82f6",
                      color: "#334155",
                    }}
                  >
                    <span style={{ fontWeight: "600", color: "#3b82f6" }}>
                      A:
                    </span>{" "}
                    {qa.answer}
                  </div>
                </div>
              ))
          )}
        </div>

        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}
