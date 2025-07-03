import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";

// Helper: decode JWT payload
function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

// Login: POST to /api/token/ and store tokens
export async function login(username, password) {
  const response = await axios.post(`${API_BASE}/api/token/`, { username, password });
  const { access, refresh } = response.data;
  localStorage.setItem("accessToken", access);
  localStorage.setItem("refreshToken", refresh);
  return access;
}

// Logout: Remove tokens
export function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

// Get user info from token (decode JWT)
export function getUser() {
  const access = localStorage.getItem("accessToken");
  if (!access) return null;
  const payload = parseJwt(access);
  if (!payload) return null;
  // Standard JWT claims: username, email, etc. (depends on backend config)
  return {
    username: payload.username || payload.user_name || payload.sub || "User",
    email: payload.email,
    ...payload,
  };
}

// Register: POST to /users/api/register/
export async function register(username, email, password) {
  const response = await axios.post(`${API_BASE}/users/api/register/`, { username, email, password });
  return response.data;
}

// Get current user profile
export async function getProfile() {
  const access = localStorage.getItem("accessToken");
  const response = await axios.get(`${API_BASE}/users/api/profile/`, {
    headers: { Authorization: `Bearer ${access}` },
  });
  return response.data;
}

// Update current user profile
export async function updateProfile(data) {
  const access = localStorage.getItem("accessToken");
  const response = await axios.put(`${API_BASE}/users/api/profile/`, data, {
    headers: { Authorization: `Bearer ${access}` },
  });
  return response.data;
}

// Change password
export async function changePassword(old_password, new_password) {
  const access = localStorage.getItem("accessToken");
  const response = await axios.put(
    `${API_BASE}/users/api/change-password/`,
    { old_password, new_password },
    { headers: { Authorization: `Bearer ${access}` } }
  );
  return response.data;
}

// Get all users (admin only)
export async function getAllUsers() {
  const access = localStorage.getItem("accessToken");
  const response = await axios.get(`${API_BASE}/users/api/admin/users/`, {
    headers: { Authorization: `Bearer ${access}` },
  });
  return response.data;
}

// Set user active status (admin only)
export async function setUserActive(user_id, is_active) {
  const access = localStorage.getItem("accessToken");
  const response = await axios.patch(
    `${API_BASE}/users/api/admin/users/${user_id}/status/`,
    { is_active },
    { headers: { Authorization: `Bearer ${access}` } }
  );
  return response.data;
}

// Edit user details (admin only)
export async function editUser(user_id, data) {
  const access = localStorage.getItem("accessToken");
  const response = await axios.patch(
    `${API_BASE}/users/api/admin/users/${user_id}/edit/`,
    data,
    { headers: { Authorization: `Bearer ${access}` } }
  );
  return response.data;
}

// Get activity feed
export async function getActivityFeed() {
  const access = localStorage.getItem("accessToken");
  const response = await axios.get(`${API_BASE}/users/api/activity/`, {
    headers: { Authorization: `Bearer ${access}` },
  });
  return response.data;
}

// Get dashboard analytics
export async function getDashboardAnalytics() {
  const access = localStorage.getItem("accessToken");
  const response = await axios.get(`${API_BASE}/users/api/dashboard-analytics/`, {
    headers: { Authorization: `Bearer ${access}` },
  });
  return response.data;
}

// Get documents (role-aware)
export async function getDocuments() {
  const access = localStorage.getItem("accessToken");
  const response = await axios.get(`${API_BASE}/documents/api/documents/`, {
    headers: { Authorization: `Bearer ${access}` },
  });
  return response.data;
}

// Get chatrooms (role-aware)
export async function getChatRooms() {
  const access = localStorage.getItem("accessToken");
  const response = await axios.get(`${API_BASE}/chat/api/chatroom/`, {
    headers: { Authorization: `Bearer ${access}` },
  });
  return response.data;
}

// Get messages (role-aware)
export async function getMessages() {
  const access = localStorage.getItem("accessToken");
  const response = await axios.get(`${API_BASE}/chat/api/message/`, {
    headers: { Authorization: `Bearer ${access}` },
  });
  return response.data;
}

// Get whiteboards (role-aware)
export async function getWhiteboards() {
  const access = localStorage.getItem("accessToken");
  const response = await axios.get(`${API_BASE}/whiteboard/api/whiteboard/`, {
    headers: { Authorization: `Bearer ${access}` },
  });
  return response.data;
}

// Create a new whiteboard
export async function createWhiteboard(data) {
  const access = localStorage.getItem("accessToken");
  const response = await axios.post(
    `${API_BASE}/whiteboard/api/whiteboards/`,
    data,
    { headers: { Authorization: `Bearer ${access}` } }
  );
  return response.data;
}

// Create a new chat room
export async function createChatRoom(data) {
  const access = localStorage.getItem("accessToken");
  const response = await axios.post(
    `${API_BASE}/chat/api/chatrooms/`,
    data,
    { headers: { Authorization: `Bearer ${access}` } }
  );
  return response.data;
}
