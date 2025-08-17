import { useRef, useState } from "react";
import api from "../api";

export default function UploadArea({ onUploaded }) {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef();

  const styles = {
    card: {
      border: "1px solid #e2e8f0",
      background: "#fff",
      borderRadius: 14,
      boxShadow: "0 1px 0 rgba(15,23,42,0.02), 0 1px 3px rgba(15,23,42,0.04)",
      padding: 16,
    },
    drop: (active) => ({
      display: "grid",
      placeItems: "center",
      textAlign: "center",
      gap: 10,
      padding: 20,
      borderRadius: 12,
      border: `2px dashed ${active ? "#93c5fd" : "#cbd5e1"}`,
      background: active ? "#f8fbff" : "#f8fafc",
      transition: "border-color 120ms ease, background 120ms ease",
    }),
    iconWrap: {
      height: 48,
      width: 48,
      display: "grid",
      placeItems: "center",
      borderRadius: 12,
      background:
        "linear-gradient(135deg, #f1f5f9 0%, #eef2f7 60%, #e2e8f0 100%)",
      color: "#0f172a",
      boxShadow: "inset 0 0 0 1px #e5e7eb",
    },
    title: { margin: 0, fontSize: 16, fontWeight: 700, color: "#0f172a" },
    help: { margin: 0, fontSize: 13, color: "#64748b" },
    btn: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      padding: "8px 12px",
      fontSize: 14,
      fontWeight: 700,
      borderRadius: 10,
      border: "1px solid #0f172a",
      background: "#0f172a",
      color: "#fff",
      cursor: "pointer",
      transition: "transform 120ms ease, box-shadow 120ms ease, opacity 120ms",
      boxShadow: "0 6px 16px rgba(15,23,42,0.18)",
    },
    btnHover: {
      transform: "translateY(-1px)",
      boxShadow: "0 10px 24px rgba(15,23,42,0.22)",
    },
    btnSecondary: {
      border: "1px solid #e2e8f0",
      background: "#ffffff",
      color: "#0f172a",
      boxShadow: "0 2px 6px rgba(15,23,42,0.06)",
    },
    btnDisabled: { opacity: 0.7, cursor: "not-allowed", transform: "none" },
    actionsRow: { display: "flex", gap: 8, justifyContent: "center" },

    fileWrap: {
      marginTop: 12,
      display: "grid",
      gap: 8,
      textAlign: "left",
      width: "100%",
    },
    chip: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      maxWidth: "100%",
      padding: "6px 10px",
      borderRadius: 999,
      border: "1px solid #e2e8f0",
      background: "#f8fafc",
      color: "#0f172a",
      fontSize: 13,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    meta: { fontSize: 12, color: "#64748b" },
    spinner: {
      width: 14,
      height: 14,
      borderRadius: "50%",
      border: "2px solid #ffffff",
      borderTopColor: "transparent",
      animation: "spin 0.8s linear infinite",
    },
    keyframes: `
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `,
  };

  const uploadFile = async () => {
    if (!file || uploading) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("pdf", file);
      const { data } = await api.post("/api/documents/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onUploaded?.(data);
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
    } catch (e) {
      alert(e?.response?.data?.error || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped && dropped.type === "application/pdf") {
      setFile(dropped);
    } else {
      alert("Please drop a PDF file.");
    }
  };

  const onPick = (e) => {
    const picked = e.target.files?.[0];
    if (picked) {
      if (picked.type === "application/pdf") setFile(picked);
      else alert("Please select a PDF file.");
    }
  };

  const onCancel = () => {
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  // simple inline hover states (no external CSS)
  let chooseHover = false;
  let submitHover = false;
  let cancelHover = false;

  const chooseStyle = () => ({
    ...styles.btn,
    ...(chooseHover ? styles.btnHover : {}),
    ...(uploading ? styles.btnDisabled : {}),
  });
  const submitStyle = () => ({
    ...styles.btn,
    ...(submitHover ? styles.btnHover : {}),
    ...(uploading ? styles.btnDisabled : {}),
  });
  const cancelStyle = () => ({
    ...styles.btn,
    ...styles.btnSecondary,
    ...(cancelHover ? styles.btnHover : {}),
    ...(uploading ? styles.btnDisabled : {}),
  });

  // helpers
  const kb = (n) => `${Math.round(n / 1024).toLocaleString()} KB`;

  return (
    <div style={styles.card}>
      <style>{styles.keyframes}</style>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        style={styles.drop(dragOver)}
      >
        <div style={styles.iconWrap} aria-hidden>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0f172a"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
            <path d="M14 2v6h6" />
            <path d="M12 18v-6" />
            <path d="M9 15l3-3 3 3" />
          </svg>
        </div>
        <p style={styles.title}>Upload PDF</p>
        <p style={styles.help}>
          Drag and drop your file here, or choose a file to upload.
        </p>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          style={chooseStyle()}
          onMouseEnter={() => (chooseHover = true)}
          onMouseLeave={() => (chooseHover = false)}
          disabled={uploading}
        >
          {uploading ? <span style={styles.spinner} /> : null}
          {uploading ? "Uploading…" : "Choose File"}
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          onChange={onPick}
          style={{ display: "none" }}
        />

        {file && (
          <div style={styles.fileWrap}>
            <div style={styles.chip} title={file.name}>
              {/* file icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0f172a"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                <path d="M14 2v6h6" />
              </svg>
              <span
                style={{
                  maxWidth: 260,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {file.name}
              </span>
            </div>
            <div style={styles.meta}>
              Type: {file.type || "application/pdf"} · Size: {kb(file.size)}
            </div>

            <div style={styles.actionsRow}>
              <button
                className="submit"
                onClick={uploadFile}
                style={submitStyle()}
                onMouseEnter={() => (submitHover = true)}
                onMouseLeave={() => (submitHover = false)}
                disabled={uploading}
              >
                {uploading ? "Uploading…" : "Submit"}
              </button>
              <button
                type="button"
                onClick={onCancel}
                style={cancelStyle()}
                onMouseEnter={() => (cancelHover = true)}
                onMouseLeave={() => (cancelHover = false)}
                disabled={uploading}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
