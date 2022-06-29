import RepaymentAdmin from "../../../components/repayment-admin";
import { fsmOptions } from "./index";

export async function getServerSideProps() {
  const res = await fetch(`http://localhost:5000/api/repayments`);
  const data = await res.json();
  const repaymentsPromise = await data.data.map(async (repayment) => {
    const loanee = repayment.request.loanee;
    console.log("loanee", loanee);
    const userRes = await fetch(`http://localhost:5000/api/owners/${loanee}`);
    const userData = await userRes.json();
    const user = userData.data;
    return {
      ...repayment,
      loanee: user,
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
      Loan: item.loan,
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
  return (
    <RepaymentAdmin
      list={list}
      title={title}
      description={description}
      options={fsmOptions}
    />
  );
}
