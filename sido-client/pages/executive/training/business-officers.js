import BDOAdmin from "../../../components/bdo-admin";
import { trainOptions } from "./index";

export async function getServerSideProps() {
  const res = await fetch(`http://localhost:5000/api/staff/operators?role=5`);
  const branches_res = await fetch(`http://localhost:5000/api/branches`);
  const branches_raw = await branches_res.json();
  const branches = branches_raw.data;
  const data = await res.json();
  const title = "Business Officers";
  let index = 1;
  const list = data.data.map((item) => {
    const full_name = `${item.first_name} ${item.last_name}`;
    const birthday = new Date(item.birthdate).toLocaleString("en-gb", {
      day: "numeric",
      year: "numeric",
      month: "long",
    });
    const branch = branches.find((branch) => branch.id == item.branch);
    const branch_name = branch ? branch.name : "NOT FOUND";
    const role = item.role == 4 ? "Loan Manager" : "BD Officer";

    return {
      "S/N": index++,
      Name: full_name,
      Email: item.email,
      Phone: item.phone_number,
      Birthday: birthday,
      Branch: branch_name,
      Role: role,
      Actions: [
        {
          name: "Edit",
          url: `/admin/operations-users/${item.id}`,
        },
        {
          name: "Delete",
          url: `/admin/operations-users/${item.id}/delete`,
        },
      ],
    };
  });
  const description = list.length == 1 ? "BD officer" : "BD officers";
  return { props: { list, title, description } };
}

export default function OperationUsers({ list, title, description }) {
  return (
    <BDOAdmin
      list={list}
      title={title}
      description={description}
      options={trainOptions}
    />
  );
}
