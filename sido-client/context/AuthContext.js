import { createContext, useState, useContext, useEffect, useRef } from "react";

const AuthContext = createContext({
  user: null,
  setUser: () => {},
  checkLogin: () => {},
  isLoading: false,
  setIsLoading: () => {},
});
export const AuthContextProvider = ({ children, session }) => {
  let sessionUser = useRef(null);
  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = () => {
    console.log("AuthContextProvider checkLogin");
    setIsLoading(true);
    console.log(localStorage.getItem("user"));
    try {
      sessionUser.current = JSON.parse(localStorage.getItem("user"));
      console.log("User exists");
      setUser(sessionUser.current);
      setIsLoading(false);
    } catch (error) {
      console.log("User does not exist");
      setIsLoading(false);
      console.log("AuthContextProvider sessionUser", sessionUser.current);
    }
  };

  console.log("sessionUser", sessionUser.current);
  console.log("session", session);
  const [user, setUser] = useState(sessionUser.current);
  const [isLoading, setIsLoading] = useState(false);
  return (
    <AuthContext.Provider value={{ user, setUser, isLoading, setIsLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
