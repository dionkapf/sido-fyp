import Admin from "../../../components/admin";
import { fsmOptions } from "./index";

export async function getServerSideProps() {
  const res = await fetch(`http://localhost:5000/api/loan-requests`);
  const data = await res.json();
  const title = "Loan Applications";
  let index = 1;
  const list = data.data.map((item) => {
    const amountNumber = item.amount
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    const amount = `TSh. ${amountNumber}`;
    const requestDate = new Date(item.request_date).toLocaleString("en-gb", {
      day: "numeric",
      year: "numeric",
      month: "long",
    });

    return {
      "S/N": index++,
      Loanee: item.loanee,
      Branch: item.branch.name,
      "Amount Requested": amount,
      "Date of Requested": requestDate,
      Status: item.status,
      Actions: [
        {
          name: "ACCEPT",
          url: `#`,
        },
        {
          name: "REJECT",
          url: `#`,
        },
      ],
    };
  });
  const description =
    list.length == 1 ? "loan application" : "loan applications";
  return { props: { list, title, description } };
}

export default function LoanApps({ list, title, description }) {
  return (
    <Admin
      list={list}
      title={title}
      description={description}
      options={fsmOptions}
    />
  );
}
