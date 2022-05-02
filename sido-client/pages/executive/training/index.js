import DashboardLayout from "../../../components/dashboard-layout";
import { useAuth } from "../../../context/AuthContext";
import Router, { useRouter } from "next/router";
import { useEffect } from "react";
import ExecDashboard from "../../../components/exec-dashboard";

export const trainOptions = [
  {
    label: "Home",
    href: "/executive/training",
  },
  {
    label: "BD OFFICERS",
    href: "/executive/training/business-officers",
  },
  {
    label: "FORMALIZATION REQUESTS",
    href: "/executive/training/requests",
  },
];
export default function Admin({ list }) {
  const { user, setUser } = useAuth();
  const router = useRouter();
  useEffect(() => {
    console.log("Admin user", user);
    if (!user) {
      console.log("No user!");
      router.push("/login");
    } else if (user.role !== 3) {
      router.push("/");
    }
  }, [router, user]);

  return (
    <DashboardLayout sidebarOptions={trainOptions} title="Admin Dashboard">
      <ExecDashboard cardData={list} />
    </DashboardLayout>
  );
}

export async function getServerSideProps() {
  const [userCountRes, executiveCountRes, operationCountRes] =
    await Promise.all([
      fetch("http://localhost:5000/api/owners?count"),
      fetch("http://localhost:5000/api/staff/executives?count"),
      fetch("http://localhost:5000/api/staff/operators?count"),
    ]);
  const [userCountJSON, executiveCountJSON, operationCountJSON] =
    await Promise.all([
      userCountRes.json(),
      executiveCountRes.json(),
      operationCountRes.json(),
    ]);

  const userCount = userCountJSON.data;
  const execCount = executiveCountJSON.data;
  const opsCount = operationCountJSON.data;
  const userDesc =
    userCount == 1 ? "registered end user" : "registered end users";
  const execDesc = execCount == 1 ? "executive" : "executives";
  const opsDesc = opsCount == 1 ? "operations user" : "operations users";
  const users = {
    title: "Users",
    description: userDesc,
    link: "/admin/users",
    count: userCount,
  };
  const executives = {
    title: "Executive Users",
    description: execDesc,
    link: "/admin/executive-users",
    count: execCount,
  };
  const operators = {
    title: "Operations Users",
    description: opsDesc,
    link: "/admin/operations-users",
    count: opsCount,
  };
  const list = { users, executives, operators };
  return { props: { list } };
}
