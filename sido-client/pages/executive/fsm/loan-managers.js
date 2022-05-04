import Admin from "../../../components/admin";
import { fsmOptions } from "./index";

export async function getServerSideProps() {
  const res = await fetch(`http://localhost:5000/api/staff/operators`);
  const branches_res = await fetch(`http://localhost:5000/api/branches`);
  const branches_raw = await branches_res.json();
  const branches = branches_raw.data;
  const data = await res.json();
  const title = "Loan Managers";
  let index = 1;
  const list = data.data
    .filter((i) => i.role == 4)
    .map((item) => {
      const full_name = `${item.first_name} ${item.last_name}`;
      const birthday = new Date(item.birthdate).toLocaleString("en-gb", {
        day: "numeric",
        year: "numeric",
        month: "long",
      });
      const branch = branches.find((branch) => branch.id == item.branch);
      const branch_name = branch ? branch.name : "NOT FOUND";

      return {
        "S/N": index++,
        Name: full_name,
        Email: item.email,
        Phone: item.phone_number,
        Birthday: birthday,
        Branch: branch_name,
        Role: "Loan Manager",
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
  const description = list.length == 1 ? "loan manager" : "loan managers";
  return { props: { list, title, description } };
}

export default function LoanManagers({ list, title, description }) {
  return (
    <Admin
      list={list}
      title={title}
      description={description}
      options={fsmOptions}
    />
  );
}
