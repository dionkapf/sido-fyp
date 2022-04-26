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
