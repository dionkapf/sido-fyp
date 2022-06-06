import DashboardLayout from "../../../components/dashboard-layout";
import { useAuth } from "../../../context/AuthContext";
import Router, { useRouter } from "next/router";
import { useEffect } from "react";
import LoanDashboard from "../../../components/loan-dashboard";

export const loanOptions = [
  {
    label: "Home",
    href: "/operation/loan",
  },
  {
    label: "Loan Applications",
    href: "/operation/loan/loan-apps",
  },
  {
    label: "Loans",
    href: "/operation/loan/loans",
  },
];

export default function LoanManagerHome({ list }) {
  const { user } = useAuth();
  const formatMoney = (amount) => {
    const amountNumber = amount
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return `TSh. ${amountNumber}`;
  };

  const branch = user ? user.branch : "";
  console.log("Full", list.amountRequested.data);
  const amountData = list.amountRequested.data.find(
    (item) => item.branch == branch
  );
  list.requests.count = list.requests.list.filter(
    (item) => item.branch.id == branch
  ).length;
  console.log("Loan", list.loans.list);
  console.log("Request", list.requests.list);
  list.amountRequested.count = formatMoney(
    parseInt(amountData ? amountData.sum : 0)
  );

  const router = useRouter();
  useEffect(() => {
    if (!user) {
      console.log("FSM user", user);
      router.push("/login");
    } else if (user.role !== 4) {
      console.log("Wrong user", user);
      router.push("/");
    }
  }, [router, user]);

  return (
    <DashboardLayout
      sidebarOptions={loanOptions}
      title="Financial Manager Dashboard"
    >
      <LoanDashboard cardData={list} />
    </DashboardLayout>
  );
}

export async function getServerSideProps() {
  const [requestListRes, loansCountRes, requestAmountRes] = await Promise.all([
    fetch("http://localhost:5000/api/loan-requests"),
    fetch("http://localhost:5000/api/loans?count"),
    fetch("http://localhost:5000/api/loan-requests?amount&branch"),
  ]);
  const [requestListJSON, loansListJSON, requestAmountJSON] = await Promise.all(
    [requestListRes.json(), loansCountRes.json(), requestAmountRes.json()]
  );

  const requestList = requestListJSON.data;
  const loansCount = loansListJSON.data;
  const requestAmountPerBranch = requestAmountJSON.data;
  const requestDesc =
    requestList.length == 1 ? "loan application" : "loan applications";
  const loansDesc = loansCount == 1 ? "loan" : "loans";
  const requestAmountDesc = "requested";
  const requests = {
    title: "Loan Applications",
    description: requestDesc,
    link: "/operation/loan/loan-apps",
    count: requestList.length,
    list: requestList,
  };
  const loans = {
    title: "Loans Disbursed",
    description: loansDesc,
    link: "/operation/loan/loans",
    count: loansCount,
  };
  const amountRequested = {
    title: "Amount Requested",
    description: requestAmountDesc,
    data: requestAmountPerBranch,
  };

  const list = { requests, loans, amountRequested };
  return { props: { list } };
}
