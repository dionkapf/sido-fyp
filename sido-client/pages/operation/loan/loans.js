import Admin from "../../../components/admin";
import { loanOptions } from "./index";
import { useAuth } from "../../../context/AuthContext";

export async function getServerSideProps() {
  const res = await fetch(`http://localhost:5000/api/repayments`);
  const data = await res.json();
  const repaymentsPromise = await data.data.map(async (repayment) => {
    const loanee_id = repayment.request.loanee;
    const loan_id = repayment.request.loan;
    console.log("loanee", loanee_id);
    console.log("loan", loan_id);
    const userRes = await fetch(
      `http://localhost:5000/api/owners/${loanee_id}`
    );
    const loanRes = await fetch(
      `http://localhost:5000/api/loan-requests/${loan_id}`
    );
    const loanData = await loanRes.json();
    const loan = loanData.data;
    const userData = await userRes.json();
    const loanee = userData.data;
    return {
      ...repayment,
      loanee,
      loan,
    };
  });
  console.log("repaymentsPromise", repaymentsPromise);
  const title = "Loan Repayments";
  let index = 1;
  const repayments = await Promise.all(repaymentsPromise);
  console.log("repayments", repayments);
  const list = repayments.map((item) => {
    const amountNumber = item.amount
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    const amount = `TSh. ${amountNumber}`;
    const payDate = new Date(item.payment_date).toLocaleString("en-gb", {
      day: "numeric",
      year: "numeric",
      month: "long",
    });

    return {
      "S/N": index++,
      Branch: item.loan.branch.name,
      Loanee: `${item.loanee.first_name} ${item.loanee.last_name}`,
      "Payment Date": payDate,
      "Receipt Number": item.receipt_number,
      "Amount Paid": amount,
      Actions: [
        {
          name: "Edit",
          url: `/admin/operations-users/${item.id}`,
        },
        {
          name: "Delete",
          url: `/admin/operations-users/${item.id}/delete`,
        },
      ],
    };
  });
  const description = list.length == 1 ? "loan repayment" : "loan repayments";
  return { props: { list, title, description } };
}

export default function Repayments({ list, title, description }) {
  const { user } = useAuth();
  console.log("user", user);
  const filteredList = user
    ? list.filter((item) => item.Branch == user.branch_name)
    : list;
  return (
    <Admin
      list={list}
      title={title}
      description={description}
      options={loanOptions}
    />
  );
}
