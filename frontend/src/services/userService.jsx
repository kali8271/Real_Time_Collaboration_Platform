import axios from "axios";

const API_URL = "http://127.0.0.1:8000/users/api/users/";

export const getUsers = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data; // ✅ Return JSON data
  } catch (error) {
    console.error("Error fetching users:", error.response?.data || error.message);
    return []; // ✅ Return empty array on error
  }
};
