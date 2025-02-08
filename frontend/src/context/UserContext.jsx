import { createContext, useContext, useState } from "react";

// Create Context
const UserContext = createContext();

// Provide Context
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom Hook to Use Context
export const useUser = () => {
  return useContext(UserContext);
};
