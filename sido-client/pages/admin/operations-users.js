import Admin from "../../components/admin";
import { adminOptions } from "./index";

export async function getServerSideProps() {
  const res = await fetch(`http://localhost:5000/api/staff/operators`);
  const data = await res.json();
  const title = "Operation Users";
  const description = "loan managers and business development officers";
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
