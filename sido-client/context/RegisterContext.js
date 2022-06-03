import { createContext, useState, useContext } from "react";

const RegisterContext = createContext({
  account: null,
  setAccount: () => {},
  owner: null,
  setOwner: () => {},
  business: null,
  setBusiness: () => {},
});
export const RegisterContextProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [owner, setOwner] = useState(null);
  const [business, setBusiness] = useState(null);

  return (
    <RegisterContext.Provider
      value={{ account, setAccount, owner, setOwner, business, setBusiness }}
    >
      {children}
    </RegisterContext.Provider>
  );
};

export function useRegisterContext() {
  return useContext(RegisterContext);
}

export default RegisterContext;
