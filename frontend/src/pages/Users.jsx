import React, { useEffect, useState } from "react";
import { getAllUsers } from "../services/auth";
import { useUser } from "../context/UserContext";
import LoadingSpinner from "../components/LoadingSpinner";

const Users = () => {
  const { user } = useUser();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && (user.is_superuser || user.is_staff)) {
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
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) return <LoadingSpinner />;

  if (!user) return <div>Please log in to view users.</div>;

  if (!(user.is_superuser || user.is_staff)) {
    // Client: show only their own profile
    return (
      <div style={{ maxWidth: 500, margin: "2rem auto", padding: 32, background: "var(--card-bg)", borderRadius: 12, boxShadow: "0 2px 12px #eee" }}>
        <h2>My Profile</h2>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <img
            src={user.profile_picture && user.profile_picture.startsWith("/media/") ? `http://127.0.0.1:8000${user.profile_picture}` : user.profile_picture || "https://ui-avatars.com/api/?name=User"}
            alt="Profile"
            style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: "2px solid #eee", marginBottom: 8 }}
          />
          <h3 style={{ margin: 0 }}>{user.username}</h3>
          <div style={{ color: '#888', marginBottom: 8 }}>{user.email}</div>
          <span style={{
            display: 'inline-block',
            background: user.is_superuser || user.is_staff ? '#007bff' : '#28a745',
            color: '#fff',
            borderRadius: 8,
            padding: '2px 10px',
            fontSize: 14,
            marginBottom: 8
          }}>
            {user.is_superuser ? 'Admin' : user.is_staff ? 'Staff' : 'User'}
          </span>
        </div>
      </div>
    );
  }

  // Admin/staff: show all users with search/filter
  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto", padding: 32, background: "var(--card-bg)", borderRadius: 12, boxShadow: "0 2px 12px #eee" }}>
      <h2>All Users</h2>
      <input
        type="text"
        placeholder="Search by username or email"
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: 16, width: 240, padding: 6, borderRadius: 6, border: '1px solid #ccc' }}
      />
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Active</th>
            <th>Staff</th>
            <th>Superuser</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.is_active ? "Yes" : "No"}</td>
              <td>{u.is_staff ? "Yes" : "No"}</td>
              <td>{u.is_superuser ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users; 