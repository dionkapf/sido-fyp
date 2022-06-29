import DashboardLayout from "../../../components/dashboard-layout";
import { useAuth } from "../../../context/AuthContext";
import Router, { useRouter } from "next/router";
import { useEffect } from "react";
import FSMDashboard from "../../../components/fsm-dashboard";

export const fsmOptions = [
  {
    label: "Home",
    href: "/executive/fsm",
  },
  {
    label: "LOAN MANAGERS",
    href: "/executive/fsm/loan-managers",
  },
  {
    label: "Loan Applications",
    href: "/executive/fsm/loan-apps",
  },
  {
    label: "Loan Repayments",
    href: "/executive/fsm/repayments",
  },
];

export default function FSMHome({ list }) {
  const { user, setUser } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!user) {
      console.log("FSM user", user);
      router.push("/login");
    } else if (user.role !== 2) {
      console.log("Wrong user", user);
      router.push("/");
    }
  }, [router, user]);

  return (
    <DashboardLayout
      sidebarOptions={fsmOptions}
      title="Financial Manager Dashboard"
    >
      <FSMDashboard cardData={list} />
    </DashboardLayout>
  );
}

export async function getServerSideProps() {
  const [
    requestCountRes,
    loansCountRes,
    managerCountRes,
    requestAmountRes,
    paidAmountRes,
  ] = await Promise.all([
    fetch("http://localhost:5000/api/loan-requests?count"),
    fetch("http://localhost:5000/api/loans?count"),
    fetch("http://localhost:5000/api/staff/operators?count&role=4"),
    fetch("http://localhost:5000/api/loan-requests?amount"),
    fetch("http://localhost:5000/api/repayments?amount"),
  ]);
  const [
    requestCountJSON,
    loansCountJSON,
    managerCountJSON,
    requestAmountJSON,
    paidAmountJSON,
  ] = await Promise.all([
    requestCountRes.json(),
    loansCountRes.json(),
    managerCountRes.json(),
    requestAmountRes.json(),
    paidAmountRes.json(),
  ]);

  const formatMoney = (amount) => {
    const amountNumber = amount
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return `TSh. ${amountNumber}`;
  };

  const requestCount = requestCountJSON.data;
  const loansCount = loansCountJSON.data;
  const managerCount = managerCountJSON.data;
  const requestAmount = formatMoney(requestAmountJSON.data[0].sum);
  const paidAmount = formatMoney(paidAmountJSON.data);
  const requestDesc =
    requestCount == 1 ? "loan application" : "loan applications";
  const loansDesc = loansCount == 1 ? "repayment" : "repayments";
  const managerDesc = managerCount == 1 ? "loan manager" : "loan managers";
  const requestAmountDesc = "requested";
  const paidAmountDesc = "paid";
  const requests = {
    title: "Loan Applications",
    description: requestDesc,
    link: "/executive/fsm/loan-apps",
    count: requestCount,
  };
  const repayments = {
    title: "Loan Repayments",
    description: loansDesc,
    link: "/executive/fsm/repayments",
    count: loansCount,
  };
  const managers = {
    title: "Operations Users",
    description: managerDesc,
    link: "/executive/fsm/loan-managers",
    count: managerCount,
  };
  const amountRequested = {
    title: "Amount Requested",
    description: requestAmountDesc,
    count: requestAmount,
  };
  const amountPaid = {
    title: "Amount Paid",
    description: paidAmountDesc,
    count: paidAmount,
  };

  const list = { requests, repayments, managers, amountRequested, amountPaid };
  return { props: { list } };
}
