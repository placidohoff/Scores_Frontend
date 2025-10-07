/**
 * This hook is imported whenever we need another component to use the global context
 */
import { useState, createContext, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

/**
 *
 * Children refers the the <App/> and all the components it contains.
 * AuthContext will wrap the entire app so that its state will be available throughout
 *
 * This component will wrap the <App/> via index.js file
 */
const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });

  /**
   * We configure axios with headers and base_url already set so whenever we call on auth.js we don't have to configure it in the file that calls it.
   */
  axios.defaults.baseURL = process.env.REACT_APP_API;
  axios.defaults.headers.common["Authorization"] = auth?.token

  /**
   * LOGIN THE USER IF THERE IS AN AUTH SAVED IN LOCAL STORAGE
   */
  useEffect(() => {
    const data = localStorage.getItem("auth");
    if (data) {
      /**
       * We set the application's auth if we have data already saved in local storage
       */
      const parsed = JSON.parse(data);
      setAuth({ ...auth, user: parsed.user, token: parsed.token });
    }
  }, []);

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * We create our own hook to be used/called elsewhere wherever needed
 * An example usage would follow: const [auth, setAuth] = useAuth();
 * This hook returns the useContext() which is the global state?
 */
const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
