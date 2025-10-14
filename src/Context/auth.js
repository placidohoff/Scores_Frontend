import { useState, createContext, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const getInitialAuth = () => {
  // Load saved auth (if any) synchronously from localStorage
  const stored = localStorage.getItem("auth");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return { user: null, token: "" };
    }
  }
  return { user: null, token: "" };
};

//!!! TODO: STORE THE TOKEN IN A CTXUSER GLOBAL STATE TO BE DECODED BY CHILD COMPONENTS INSTEAD OF STORING IT IN LOCALSTORAGE !!!


const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(getInitialAuth);

  const logout = () => {
    setAuth({ user: null, token: "", id:'' });
    localStorage.removeItem("auth");
    
  };

  
  // Configure axios base and headers
  axios.defaults.baseURL = process.env.REACT_APP_API;
  axios.defaults.headers.common["Authorization"] = auth?.token || "";

  // Keep localStorage in sync with state
  useEffect(() => {
    if (auth?.token) {
      localStorage.setItem("auth", JSON.stringify(auth));
    } else {
      localStorage.removeItem("auth");
    }
  }, [auth]);

  return (
    <AuthContext.Provider value={{auth, setAuth, logout}}>
      {children}
    </AuthContext.Provider>
  );
};


const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
