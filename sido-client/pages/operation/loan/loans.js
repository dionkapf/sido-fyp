import LoanAdmin from "../../../components/loan-admin";
import { loanOptions } from "./index";
import { useAuth } from "../../../context/AuthContext";
import { Button } from "@material-ui/core";

export async function getServerSideProps() {
  const res = await fetch(`http://localhost:5000/api/loans`);
  const data = await res.json();
  const loansPromise = await data.data.map(async (loan) => {
    const loanRequestId = loan.request_id;
    console.log("loan request in lp", loanRequestId);
    console.log("loan request in lp", loan);
    const requestRes = await fetch(
      `http://localhost:5000/api/loan-requests/${parseInt(loanRequestId)}`
    );
    const requestData = await requestRes.json();
    const request = requestData.data;
    console.log("request in lp", request);
    const ownerRes = await fetch(
      `http://localhost:5000/api/owners/${request.loanee_id}`
    );
    const ownerData = await ownerRes.json();
    const loanee = ownerData.data;
    if (requestData.success) {
      console.log("Request", request);
      console.log("loanee", loanee);
      // const loanee = request.loanee;
    } else {
      console.log("Bugger");
    }
    // const loanee = request.loanee;
    // const loanee = "Sample man";
    const branch = request.branch.name;
    // const branch = request.branch.name;
    return {
      ...loan,
      loanee,
      branch,
    };
  });
  console.log("loansPromise", loansPromise);
  const title = "Loan Disbursed";
  let index = 1;
  const loans = await Promise.all(loansPromise);
  console.log("loans", loans);
  const list = loans.map((item) => {
    const amountNumber = item.amount
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    const amount = `TSh. ${amountNumber}`;
    const approvalDate = new Date(item.approval_date).toLocaleString("en-gb", {
      day: "numeric",
      year: "numeric",
      month: "long",
    });
    const deadline = new Date(item.deadline).toLocaleString("en-gb", {
      day: "numeric",
      year: "numeric",
      month: "long",
    });
    const interestRate = `${item.interest_rate}%`;
    return {
      "S/N": index++,
      Loanee: `${item.loanee.first_name} ${item.loanee.last_name}`,
      Branch: item.branch,
      "Approval Date": approvalDate,
      Deadline: deadline,
      "Amount Loaned": amount,
      "Interest Rate": interestRate,
      Actions: [
        {
          name: "PAYMENTS",
          url: `/operation/loan/payments/${item.id}`,
        },
      ],
    };
  });
  const description = list.length == 1 ? "loan" : "loans";

  return { props: { list, title, description } };
}

export default function Loans({ list, title, description }) {
  const { user } = useAuth();
  console.log("user", user);
  const filteredList = user
    ? list.filter((item) => item.Branch == user.branch_name)
    : list;
  console.log("filteredList", filteredList);
  return (
    <>
      <LoanAdmin
        list={list}
        title={title}
        description={description}
        options={loanOptions}
      />
    </>
  );
}
