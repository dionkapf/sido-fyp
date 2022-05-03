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

  const checkLogin = async () => {
    console.log("AuthContextProvider checkLogin");
    setIsLoading(true);
    try {
      const checkSessionRes = await fetch(`http://localhost:5000/login/token`, {
        credentials: "include",
      });
      const checkSession = await checkSessionRes.json();
      console.log("CheckSession", checkSession);
      if (checkSession.success) {
        sessionUser.current = JSON.parse(localStorage.getItem("user"));
        console.log("User logged in");
        setUser(sessionUser.current);
        setIsLoading(false);
      } else {
        console.log("User not logged in");
        localStorage.removeItem("user");
        setIsLoading(false);
        console.log("AuthContextProvider sessionUser", sessionUser.current);
      }
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
