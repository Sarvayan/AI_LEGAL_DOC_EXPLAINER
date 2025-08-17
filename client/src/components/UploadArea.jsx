import { useRef, useState } from "react";
import api from "../api";

export default function UploadArea({ onUploaded }) {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState(null);
  const inputRef = useRef();

  const uploadFile = async () => {
    if (!file) return;
    const form = new FormData();
    form.append("pdf", file);
    const { data } = await api.post("/api/documents/upload", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    onUploaded?.(data);
    setFile(null); // clear after upload
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

  return (
    <div className="card">
      <div
        className="drag"
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        style={{ background: dragOver ? "#f8f9ff" : "transparent" }}
      >
        <p>
          <b>Upload PDF</b> via drag-and-drop or file picker
        </p>
        <button className="btn" onClick={() => inputRef.current?.click()}>
          Choose File
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          onChange={onPick}
          style={{ display: "none" }}
        />

        {file && (
          <div style={{ marginTop: 12 }}>
            <p>
              Selected: <b>{file.name}</b>
            </p>
            <div className="row" style={{ gap: 8 }}>
              <button className="btn" onClick={uploadFile}>
                Submit
              </button>
              <button className="btn" type="button" onClick={onCancel}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
