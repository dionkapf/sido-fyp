import PaymentsAdmin from "../../../../components/payments-admin";
import { loanOptions } from "../index";
import { useRouter } from "next/router";
import { useEffect } from "react";

export async function getServerSideProps(context) {
  const id = context.query.id;
  const loansRes = await fetch(`http://localhost:5000/api/loans/${id}`);
  const loansRaw = await loansRes.json();
  const loans = loansRaw.data;
  if (loans.length === 0) {
    return {
      props: {
        list: [],
        title: null,
        description: null,
        id: null,
        loanee: null,
      },
    };
  }
  const res = await fetch(`http://localhost:5000/api/repayments?loan=${id}`);
  const repaymentsData = await res.json();
  console.log("Repayment Data: ", repaymentsData);
  const list = repaymentsData.data.map((loan) => {
    const paymentDate = new Date(loan.payment_date).toLocaleString("en-gb", {
      day: "numeric",
      year: "numeric",
      month: "long",
    });
    const amount = `${loan.amount
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}`;
    // loanee_id = loan.loanee.id;
    return {
      id: loan.id,
      request_data: loan.request,
      "Payment Date": paymentDate,
      "Receipt Number": loan.receipt_number,
      Amount: amount,
      Actions: [
        {
          name: "Edit",
          url: `/`,
        },
        {
          name: "Delete",
          url: `/`,
        },
        {
          name: "Loans",
          url: `/operation/loan/loans`,
        },
      ],
    };
  });
  const loanee_id =
    repaymentsData.data.length > 0 ? repaymentsData.data[0].loanee.id : null;
  console.log("Payments: ", list);
  if (loanee_id) {
    const loaneeRes = await fetch(
      `http://localhost:5000/api/owners/${loanee_id}`
    );
    const loaneeData = await loaneeRes.json();
    console.log("Loanee Data: ", loaneeData);
    const loanee = loaneeData.data;
    const title = `Payments by ${loanee.first_name} ${loanee.last_name}`;
    const description = `Payments for  ${loanee.first_name} ${loanee.last_name}'s loan`;
    return { props: { list, title, description, id, loanee } };
  } else {
    const loanee = null;
    const title = "No Payments made";
    const description = "No recorded payments have been made for this loan";
    return { props: { list, title, description, id, loanee } };
  }
}

export default function Payments({ list, title, description, id, loanee }) {
  const router = useRouter();
  useEffect(() => {
    if (!id) {
      router.push("/operation/loan");
    }
  }, [id, router]);
  return (
    <PaymentsAdmin
      list={list}
      title={title}
      description={description}
      options={loanOptions}
      id={id}
      loanee={loanee}
    />
  );
}
