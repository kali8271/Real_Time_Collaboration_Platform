import React, { useEffect, useState } from "react";
import { getProfile, updateProfile, changePassword } from "../services/auth";
import { useUser } from "../context/UserContext";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";

const API_BASE = "http://127.0.0.1:8000";

const Profile = () => {
  const { user, setUser } = useUser();
  const [form, setForm] = useState({ username: "", email: "", bio: "", profile_picture: null });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        const data = await getProfile();
        setForm({
          username: data.username,
          email: data.email,
          bio: data.bio || "",
          profile_picture: data.profile_picture || null,
        });
        setPreview(data.profile_picture ? `${API_BASE}${data.profile_picture}` : null);
      } catch (err) {
        toast.error("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, profile_picture: file });
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("username", form.username);
      formData.append("email", form.email);
      formData.append("bio", form.bio);
      if (form.profile_picture instanceof File) {
        formData.append("profile_picture", form.profile_picture);
      }
      const updated = await updateProfile(formData);
      setUser((u) => ({ ...u, ...updated }));
      toast.success("Profile updated successfully!");
      setEditing(false);
    } catch (err) {
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await changePassword(oldPassword, newPassword);
      toast.success("Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setShowPasswordForm(false);
    } catch (err) {
      toast.error(
        err.response?.data?.old_password?.[0] ||
        err.response?.data?.new_password?.[0] ||
        err.response?.data?.detail ||
        "Failed to update password."
      );
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto", padding: 32, background: "var(--card-bg)", borderRadius: 12, boxShadow: "0 2px 12px #eee" }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <img
          src={preview || form.profile_picture || "https://ui-avatars.com/api/?name=User"}
          alt="Profile"
          style={{ width: 100, height: 100, borderRadius: "50%", objectFit: "cover", border: "2px solid #eee", marginBottom: 8 }}
        />
        <h2 style={{ margin: 0 }}>{form.username}</h2>
        <div style={{ color: '#888', marginBottom: 8 }}>{form.email}</div>
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
      {!editing ? (
        <div style={{ textAlign: "center" }}>
          <p><b>Bio:</b> {form.bio || <span style={{ color: '#aaa' }}>(none)</span>}</p>
          <button onClick={() => setEditing(true)} style={{ marginRight: 8 }}>Edit Profile</button>
          <button onClick={() => setShowPasswordForm((v) => !v)}>
            {showPasswordForm ? "Cancel Password Change" : "Change Password"}
          </button>
          {showPasswordForm && (
            <form onSubmit={handlePasswordChange} style={{ marginTop: 16 }}>
              <label>Old Password:<br/>
                <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required />
              </label><br/>
              <label>New Password:<br/>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength={8} />
              </label><br/>
              <button type="submit">Update Password</button>
            </form>
          )}
          {user.is_superuser || user.is_staff ? (
            <div style={{ marginTop: 24, color: '#007bff', fontWeight: 500 }}>
              <span>Admin Controls: You have access to the admin dashboard and user management.</span>
            </div>
          ) : null}
        </div>
      ) : (
        <form onSubmit={handleSubmit} encType="multipart/form-data" style={{ textAlign: "center" }}>
          <label>Username:<br/>
            <input name="username" value={form.username} onChange={handleChange} required disabled={loading} />
          </label><br/>
          <label>Email:<br/>
            <input name="email" value={form.email} onChange={handleChange} required disabled={loading} />
          </label><br/>
          <label>Bio:<br/>
            <textarea name="bio" value={form.bio} onChange={handleChange} disabled={loading} />
          </label><br/>
          <label>Profile Picture:<br/>
            <input type="file" accept="image/*" onChange={handleFileChange} disabled={loading} />
          </label><br/>
          <button type="submit" disabled={loading}>{loading ? "Saving..." : "Save"}</button>
          <button type="button" onClick={() => setEditing(false)} disabled={loading} style={{ marginLeft: 8 }}>Cancel</button>
        </form>
      )}
    </div>
  );
};

export default Profile; 