import { createContext, useState, useContext } from "react";

const LoanContext = createContext({
  witness1: null,
  setWitness1: () => {},
  witness2: null,
  setWitness2: () => {},
  loanData: {},
  setloanData: () => {},
});
export const LoanContextProvider = ({ children }) => {
  const [witness1, setWitness1] = useState(null);
  const [witness2, setWitness2] = useState(null);
  const [loanData, setLoanData] = useState(null);

  return (
    <LoanContext.Provider
      value={{
        witness1,
        setWitness1,
        witness2,
        setWitness2,
        loanData,
        setLoanData,
      }}
    >
      {children}
    </LoanContext.Provider>
  );
};

export function useLoanContext() {
  return useContext(LoanContext);
}

export default LoanContext;
