import Admin from "../../components/admin";
import { adminOptions } from "./index";

export async function getServerSideProps() {
  const res = await fetch(`http://localhost:5000/api/owners`);
  const data = await res.json();
  const title = "Business Owners";
  const description = "owners";
  const list = data.data;
  delete list.user_id;
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
