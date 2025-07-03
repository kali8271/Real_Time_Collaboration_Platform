import React, { useEffect, useState } from "react";
import { getWhiteboards } from "../services/auth";
import { useUser } from "../context/UserContext";
import LoadingSpinner from "../components/LoadingSpinner";

const WhiteboardPage = () => {
  const { user } = useUser();
  const [whiteboards, setWhiteboards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    async function fetchBoards() {
      setLoading(true);
      try {
        const data = await getWhiteboards();
        setWhiteboards(data);
      } catch {
        setWhiteboards([]);
      } finally {
        setLoading(false);
      }
    }
    fetchBoards();
  }, [user]);

  if (loading) return <LoadingSpinner />;
  if (!user) return <div>Please log in to view whiteboards.</div>;

  return (
    <div style={{ maxWidth: 900, margin: "2rem auto", padding: 32, background: "var(--card-bg)", borderRadius: 12, boxShadow: "0 2px 12px #eee" }}>
      <h2>Whiteboards</h2>
      {whiteboards.length === 0 ? (
        <div>No whiteboards found.</div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Owner</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {whiteboards.map(board => (
              <tr key={board.id}>
                <td>{board.id}</td>
                <td>{board.title}</td>
                <td>{board.owner}</td>
                <td>{board.created_at ? new Date(board.created_at).toLocaleString() : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default WhiteboardPage; 