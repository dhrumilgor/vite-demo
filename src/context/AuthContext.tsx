import { createContext, useContext, useState } from "react";

interface AuthContext {
  isAuthenticated: string;
  setIsAuthenticated: (value: string) => void;
}

// Create Context
const AuthContext = createContext<AuthContext>({
  isAuthenticated: 'false',
  setIsAuthenticated: () => {}
});


// Provider Component
export const AuthProvider = ({ children }) => {
    const isLogin   = localStorage.getItem('isLogin') || 'false';
    const [isAuthenticated, setIsAuthenticated] = useState<string>(isLogin);

  return (
    <AuthContext.Provider value={{ isAuthenticated,setIsAuthenticated}}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook to Use Context
export const useAuth = () => useContext(AuthContext);
