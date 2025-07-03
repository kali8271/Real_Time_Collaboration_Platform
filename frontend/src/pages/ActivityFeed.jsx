import React, { useEffect, useState } from "react";
import { getActivityFeed } from "../services/auth";

const ActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeed() {
      setLoading(true);
      try {
        const data = await getActivityFeed();
        setActivities(data);
      } catch {
        setActivities([]);
      } finally {
        setLoading(false);
      }
    }
    fetchFeed();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", padding: 20, background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #eee" }}>
      <h2>Activity Feed</h2>
      {activities.length === 0 ? (
        <div>No recent activity.</div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {activities.map(a => (
            <li key={a.id} style={{ marginBottom: 16, borderBottom: "1px solid #eee", paddingBottom: 8 }}>
              <b>{a.user}</b> <span style={{ color: '#888' }}>{a.action}</span>
              <div style={{ fontSize: 14, color: '#555' }}>{a.description}</div>
              <div style={{ fontSize: 12, color: '#aaa' }}>{new Date(a.timestamp).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ActivityFeed; 