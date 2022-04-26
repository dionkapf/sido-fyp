import DashboardLayout from "../../components/dashboard-layout";
import AdminDashboard from "../../components/admin-dashboard";

export const adminOptions = [
  {
    label: "Home",
    href: "/admin",
  },
  {
    label: "Executive Users",
    href: "/admin/executive-users",
  },
  {
    label: "Operations Users",
    href: "/admin/operations-users",
  },
  {
    label: "Users",
    href: "/admin/users",
  },
];

export default function Admin({ list }) {
  const options = [
    {
      label: "Home",
      href: "/admin",
    },
    {
      label: "Executive Users",
      href: "/admin/executive-users",
    },
    {
      label: "Operations Users",
      href: "/admin/operations-users",
    },
    {
      label: "Users",
      href: "/admin/users",
    },
  ];
  return (
    <DashboardLayout sidebarOptions={adminOptions}>
      <AdminDashboard cardData={list} />
    </DashboardLayout>
  );
}

export async function getServerSideProps() {
  const userCountRes = await (
    await fetch(`http://localhost:5000/api/owners?count`)
  ).json();
  const execCountRes = await (
    await fetch(`http://localhost:5000/api/staff/executives?count`)
  ).json();
  const opsCountRes = await (
    await fetch(`http://localhost:5000/api/staff/operators?count`)
  ).json();
  const userCount = userCountRes.data;
  const execCount = execCountRes.data;
  const opsCount = opsCountRes.data;
  const users = {
    title: "Users",
    description: "registered end users",
    link: "/admin/users",
    count: userCount,
  };
  const executives = {
    title: "Executive Users",
    description: "executives",
    link: "/admin/executive-users",
    count: execCount,
  };
  const operators = {
    title: "Operations Users",
    description: "loan managers and business development officers",
    link: "/admin/operations-users",
    count: opsCount,
  };
  const list = { users, executives, operators };
  return { props: { list } };
}
