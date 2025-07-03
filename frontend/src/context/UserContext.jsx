import { useContext, createContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const UserContext = createContext();

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

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  function isTokenExpired(token) {
    const payload = parseJwt(token);
    if (!payload || !payload.exp) return true;
    // exp is in seconds since epoch
    return Date.now() >= payload.exp * 1000;
  }

  useEffect(() => {
    const access = localStorage.getItem("accessToken");
    if (access) {
      if (isTokenExpired(access)) {
        setUser(null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/login");
      } else {
        const payload = parseJwt(access);
        setUser({
          username: payload.username || payload.user_name || payload.sub || "User",
          email: payload.email,
          is_staff: payload.is_staff,
          is_superuser: payload.is_superuser,
          ...payload,
        });
      }
    } else {
      setUser(null);
    }
    // eslint-disable-next-line
  }, [location.pathname]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
