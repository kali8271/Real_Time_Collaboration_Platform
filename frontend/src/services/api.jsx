import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/";

const DocumentList = () => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get(`${API_URL}documents/`);
        setDocuments(response.data);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };

    fetchDocuments();
  }, []);

  return (
    <div>
      <h2>Documents</h2>
      <ul>
        {documents.length > 0 ? (
          documents.map((doc) => <li key={doc.id}>{doc.title}</li>)
        ) : (
          <p>No documents found.</p>
        )}
      </ul>
    </div>
  );
};

export default DocumentList;
