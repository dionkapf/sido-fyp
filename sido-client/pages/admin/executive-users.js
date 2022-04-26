import Admin from "../../components/admin";
import { adminOptions } from "./index";
export async function getServerSideProps() {
  const res = await fetch(`http://localhost:5000/api/staff/executives`);
  const data = await res.json();
  const title = "Executive Users";
  const description = "executive users";
  const list = data.data;
  return { props: { list, title, description } };
}

export default function ExecutiveUsers({ list, title, description }) {
  return (
    <Admin
      list={list}
      title={title}
      description={description}
      options={adminOptions}
    />
  );
}
