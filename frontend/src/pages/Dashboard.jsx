import React, { useEffect, useState } from "react";
import { getAllUsers, setUserActive, editUser, getDashboardAnalytics } from "../services/auth";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

const Dashboard = () => {
  const { user } = useUser();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ username: "", email: "", is_staff: false, is_superuser: false });
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }
    async function fetchUsers() {
      setLoading(true);
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, [user, navigate]);

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }
    async function fetchAnalytics() {
      setLoading(true);
      try {
        const data = await getDashboardAnalytics();
        setAnalytics(data);
      } catch {
        setAnalytics(null);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, [user, navigate]);

  const handleToggleActive = async (userId, currentActive) => {
    await setUserActive(userId, !currentActive);
    setUsers(users => users.map(u => u.id === userId ? { ...u, is_active: !currentActive } : u));
  };

  const startEdit = (user) => {
    setEditingId(user.id);
    setEditForm({
      username: user.username,
      email: user.email,
      is_staff: user.is_staff,
      is_superuser: user.is_superuser,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ username: "", email: "", is_staff: false, is_superuser: false });
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const saveEdit = async (userId) => {
    const updated = await editUser(userId, editForm);
    setUsers(users => users.map(u => u.id === userId ? updated : u));
    cancelEdit();
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole =
      !roleFilter ||
      (roleFilter === "staff" && u.is_staff) ||
      (roleFilter === "superuser" && u.is_superuser) ||
      (roleFilter === "user" && !u.is_staff && !u.is_superuser);
    const matchesActive =
      !activeFilter ||
      (activeFilter === "active" && u.is_active) ||
      (activeFilter === "inactive" && !u.is_active);
    return matchesSearch && matchesRole && matchesActive;
  });

  if (loading || !analytics) return <LoadingSpinner />;

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto", padding: 32, background: "var(--card-bg)", borderRadius: 12, boxShadow: "0 2px 12px #eee" }}>
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>Dashboard</h2>
      {user.is_superuser || user.is_staff ? (
        <>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center', marginBottom: 32 }}>
            <StatCard label="Total Users" value={analytics.user_count} />
            <StatCard label="Active Users" value={analytics.active_user_count} />
            <StatCard label="Documents" value={analytics.document_count} />
            <StatCard label="Chatrooms" value={analytics.chatroom_count} />
            <StatCard label="Messages" value={analytics.message_count} />
            <StatCard label="Whiteboards" value={analytics.whiteboard_count} />
            <StatCard label="Activities" value={analytics.activity_count} />
          </div>
          <h3>Recent Activity</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {analytics.recent_activity.map(a => (
              <li key={a.id} style={{ marginBottom: 16, borderBottom: "1px solid #eee", paddingBottom: 8 }}>
                <b>{a.user}</b> <span style={{ color: '#888' }}>{a.action}</span>
                <div style={{ fontSize: 14, color: '#555' }}>{a.description}</div>
                <div style={{ fontSize: 12, color: '#aaa' }}>{new Date(a.timestamp).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center', marginBottom: 32 }}>
            <StatCard label="My Documents" value={analytics.my_document_count} />
            <StatCard label="My Chatrooms" value={analytics.my_chatroom_count} />
            <StatCard label="My Messages" value={analytics.my_message_count} />
            <StatCard label="My Whiteboards" value={analytics.my_whiteboard_count} />
            <StatCard label="My Activities" value={analytics.my_activity_count} />
          </div>
          <h3>Recent Activity</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {analytics.recent_activity.map(a => (
              <li key={a.id} style={{ marginBottom: 16, borderBottom: "1px solid #eee", paddingBottom: 8 }}>
                <b>{a.user}</b> <span style={{ color: '#888' }}>{a.action}</span>
                <div style={{ fontSize: 14, color: '#555' }}>{a.description}</div>
                <div style={{ fontSize: 12, color: '#aaa' }}>{new Date(a.timestamp).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

function StatCard({ label, value }) {
  return (
    <div style={{ background: '#f7fafc', color: '#222', borderRadius: 8, padding: 20, minWidth: 120, textAlign: 'center', boxShadow: '0 1px 4px #eee' }}>
      <div style={{ fontSize: 28, fontWeight: 700 }}>{value}</div>
      <div style={{ fontSize: 15, color: '#555', marginTop: 4 }}>{label}</div>
    </div>
  );
}

export default Dashboard; 