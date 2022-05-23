import { createContext, useState, useContext } from "react";

const LoanRequestContext = createContext({
  loanRequest: null,
  setLoanRequest: () => {},
  collateral: null,
  setCollateral: () => {},
});
export const LoanRequestContextProvider = ({ children }) => {
  const [loanRequest, setLoanRequest] = useState(null);
  const [collateral, setCollateral] = useState(null);
  return (
    <LoanRequestContext.Provider
      value={{ loanRequest, setLoanRequest, collateral, setCollateral }}
    >
      {children}
    </LoanRequestContext.Provider>
  );
};

export function useLoanRequest() {
  return useContext(LoanRequestContext);
}

export default LoanRequestContext;
