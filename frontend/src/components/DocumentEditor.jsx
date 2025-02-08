import React, { useState } from "react";

const DocumentEditor = () => {
  const [content, setContent] = useState("");

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Document Editor</h2>
      <textarea
        className="w-full h-64 border rounded p-2 mt-4"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
    </div>
  );
};

export default DocumentEditor;
