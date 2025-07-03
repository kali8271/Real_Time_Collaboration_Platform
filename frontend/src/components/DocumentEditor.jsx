import React, { useState } from "react";

const DocumentEditor = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async () => {
    setError("");
    setSaveSuccess(false);
    setLoading(true);
    try {
      // Simulate async save (replace with real API call in production)
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (content.trim() === "fail") {
            reject(new Error("Failed to save document."));
          } else {
            resolve();
          }
        }, 700);
      });
      setSaveSuccess(true);
    } catch (err) {
      setError(err.message || "Failed to save document.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Document Editor</h2>
      <textarea
        className="w-full h-64 border rounded p-2 mt-4"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={loading}
      />
      <div className="mt-2">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Document"}
        </button>
        {error && <div style={{ color: "red" }} className="mt-2">{error}</div>}
        {saveSuccess && <div style={{ color: "green" }} className="mt-2">Saved successfully!</div>}
      </div>
    </div>
  );
};

export default DocumentEditor;
