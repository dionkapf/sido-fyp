import Admin from "../../components/admin";
import { adminOptions } from "./index";

export async function getServerSideProps() {
  const res = await fetch(`http://localhost:5000/api/staff/operators`);
  const branches_res = await fetch(`http://localhost:5000/api/branches`);
  const branches_raw = await branches_res.json();
  const branches = branches_raw.data;
  const data = await res.json();
  const title = "Operation Users";
  const description = "loan managers and business development officers";
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
    const phone_number =
      item.phone_number[0] == "0" ? (
        <a href={`tel:+255${item.phone_number.slice(1)}`}>
          $
          {"+255 " +
            item.phone_number
              .slice(1)
              .match(/.{1,3}/g)
              .join(" ")}
        </a>
      ) : (
        <a href="tel:${item.phone_number}">
          ${item.phone_number.match(/.{1,3}/g).join(" ")}
        </a>
      );

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

  return { props: { list, title, description } };
}

export default function OperationUsers({ list, title, description }) {
  return (
    <Admin
      list={list}
      title={title}
      description={description}
      options={adminOptions}
    />
  );
}
