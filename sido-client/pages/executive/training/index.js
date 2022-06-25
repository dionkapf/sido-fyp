import DashboardLayout from "../../../components/dashboard-layout";
import { useAuth } from "../../../context/AuthContext";
import Router, { useRouter } from "next/router";
import { useEffect } from "react";
import TrainDashboard from "../../../components/train-dashboard";

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
export default function TrainingHome({ list }) {
  const { user } = useAuth();
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
    <DashboardLayout
      sidebarOptions={trainOptions}
      title="Training Mgr Dashboard"
    >
      <TrainDashboard cardData={list} />
    </DashboardLayout>
  );
}

export async function getServerSideProps() {
  const [officerCountRes, requestCountRes, informalCountRes] =
    await Promise.all([
      fetch("http://localhost:5000/api/staff/operators?count&role=5"),
      fetch("http://localhost:5000/api/formalization-requests?count"),
      fetch("http://localhost:5000/api/owners?formalized=false&count"),
    ]);
  const [officerCountJSON, requestCountJSON, informalCountJSON] =
    await Promise.all([
      officerCountRes.json(),
      requestCountRes.json(),
      informalCountRes.json(),
    ]);

  const officerCount = officerCountJSON.data;
  const requestCount = requestCountJSON.data;
  const informalCount = informalCountJSON.data;
  const officerDesc =
    officerCount == 1
      ? "business development officer"
      : "business development officers";
  const requestDesc =
    requestCount == 1 ? "formalization request" : "formalization requests";
  const informalDesc =
    informalCount == 1 ? "unregistered business" : "unregistered businesses";
  const officers = {
    title: "BD Officers",
    description: officerDesc,
    link: "/executive/training/business-officers",
    count: officerCount,
  };
  const requests = {
    title: "Requests",
    description: requestDesc,
    link: "/executive/training/requests",
    count: requestCount,
  };
  const informal = {
    title: "Informal firms",
    description: informalDesc,
    link: "/executive/training/informal",
    count: informalCount,
  };
  const list = { officers, requests, informal };
  return { props: { list } };
}
