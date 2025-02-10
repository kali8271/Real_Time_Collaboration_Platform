import React, { useEffect, useState } from "react";
import { getUsers } from "../services/userService";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers(); // ✅ Fetch users
        setUsers(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h2>User List</h2>
      {error ? (
        <p style={{ color: "red" }}>Error: {error}</p>
      ) : users.length > 0 ? (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              <img
                src={user.profile_picture}
                alt={user.username}
                style={{ width: "50px", borderRadius: "50%" }}
              />
              <strong>{user.username}</strong> ({user.email}) - {user.bio}
              {user.is_online ? " 🟢 Online" : " 🔴 Offline"}
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading users...</p>
      )}
    </div>
  );
};

export default UserList;
