import DashboardLayout from "../../../components/dashboard-layout";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";
import OfficerDashboard from "../../../components/officer-dashboard";

export const officerOptions = [
  {
    label: "Home",
    href: "/operation/business",
  },
  {
    label: "Owners",
    href: "/operation/business/owners",
  },
  {
    label: "Formalization Requests",
    href: "/operation/business/requests",
  },
];

export default function BusinessOfficerHome({ list }) {
  const { user } = useAuth();

  const router = useRouter();
  useEffect(() => {
    if (!user) {
      console.log("BDO user", user);
      router.push("/login");
    } else if (user.role !== 5) {
      console.log("Wrong user", user);
      router.push("/");
    }
  }, [router, user]);

  return (
    <DashboardLayout
      sidebarOptions={officerOptions}
      title="Business Dev. Officer Dashboard"
    >
      <OfficerDashboard cardData={list} />
    </DashboardLayout>
  );
}

export async function getServerSideProps() {
  const [ownersRes, informalCountRes, requestsRes] = await Promise.all([
    fetch("http://localhost:5000/api/owners"),
    fetch("http://localhost:5000/api/owners?formalized=false"),
    fetch("http://localhost:5000/api/formalization-requests"),
  ]);
  const [ownersCountJSON, informalCountJSON, requestCountJSON] =
    await Promise.all([
      ownersRes.json(),
      informalCountRes.json(),
      requestsRes.json(),
    ]);

  const ownersCount = ownersCountJSON.data;
  const informalCount = informalCountJSON.data;
  const requestCount = requestCountJSON.data;
  const ownersDesc = ownersCount.length == 1 ? "owner" : "owners";
  const informalDesc =
    informalCount == 1 ? "unregisetered business" : "unregisetered businesses";
  const requestCountDesc = requestCount == 1 ? "request" : "requests";
  const owners = {
    title: "Businesses",
    description: ownersDesc,
    link: "/operation/business/owners",
    count: ownersCount.length,
    list: ownersCount,
  };
  const informals = {
    title: "Informal Firms",
    description: informalDesc,
    link: "/operation/business/informals",
    count: informalCount.length,
    list: informalCount,
  };
  const requests = {
    title: "Requests",
    description: requestCountDesc,
    link: "/operation/business/requests",
    list: requestCount,
  };

  const list = {
    owners,
    informals,
    requests,
  };
  return { props: { list } };
}
