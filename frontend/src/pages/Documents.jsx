import React, { useEffect, useState } from "react";
import { getDocuments } from "../services/auth";
import { useUser } from "../context/UserContext";
import LoadingSpinner from "../components/LoadingSpinner";

const Documents = () => {
  const { user } = useUser();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    async function fetchDocs() {
      setLoading(true);
      try {
        const data = await getDocuments();
        setDocuments(data);
      } catch {
        setDocuments([]);
      } finally {
        setLoading(false);
      }
    }
    fetchDocs();
  }, [user]);

  if (loading) return <LoadingSpinner />;
  if (!user) return <div>Please log in to view documents.</div>;

  return (
    <div style={{ maxWidth: 900, margin: "2rem auto", padding: 32, background: "var(--card-bg)", borderRadius: 12, boxShadow: "0 2px 12px #eee" }}>
      <h2>Documents</h2>
      {documents.length === 0 ? (
        <div>No documents found.</div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Owner</th>
              <th>Created</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {documents.map(doc => (
              <tr key={doc.id}>
                <td>{doc.id}</td>
                <td>{doc.title}</td>
                <td>{doc.owner}</td>
                <td>{new Date(doc.created_at).toLocaleString()}</td>
                <td>{new Date(doc.updated_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Documents; 