import React, { useState } from "react";
import { useParams } from "react-router-dom";

const Editor = () => {
  const { docId } = useParams();
  const [content, setContent] = useState("");

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Editing Document #{docId}</h2>
      <textarea
        className="w-full h-64 p-2 border rounded mt-4"
        placeholder="Start typing here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>
    </div>
  );
};

export default Editor;
