import Admin from "../../../components/admin";
import { officerOptions } from "./index";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";

export async function getServerSideProps() {
  const res = await fetch(
    `http://localhost:5000/api/formalization-requests?status=pending`
  );
  const owners_res = await fetch(`http://localhost:5000/api/owners`);
  const owners_raw = await owners_res.json();
  const owners = owners_raw.data;
  const data = await res.json();
  const title = "Formalization Requests";
  let index = 1;
  const list = data.data.map((item) => {
    const owner = owners.find((owner) => owner.id == item.owner_id);
    const owner_name = owner
      ? `${owner.first_name} ${owner.last_name}`
      : "NOT FOUND";
    const requestDate = new Date(item.request_date).toLocaleString("en-gb", {
      day: "numeric",
      year: "numeric",
      month: "long",
    });

    return {
      id: item.id,
      "S/N": index++,
      Owner: owner_name,
      "Date Requested": requestDate,
      Branch: item.branch.name,
      Status: item.status,
      Actions: [
        {
          name: "View",
          url: `/admin/operations-users/${item.id}`,
        },
        {
          name: "Verify",
          url: `/admin/operations-users/${item.id}`,
        },
        {
          name: "Reject",
          url: `/admin/operations-users/${item.id}`,
        },
      ],
    };
  });
  const description =
    list.length == 1 ? "formalization request" : "formalization requests";
  console.log("List in gss:", list);
  return { props: { list, title, description, data: data.data, owners } };
}

export default function Requests({ list, title, description, data, owners }) {
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

  const generateList = (data) => {
    let index = 1;
    const filteredData =
      data && user && user.branch
        ? data.filter((item) => {
            return item.branch.id == user.branch;
          })
        : data;
    console.log("filteredData", filteredData);

    const list = filteredData.map((item) => {
      const owner = owners.find((owner) => owner.id == item.owner_id);
      const owner_name = owner
        ? `${owner.first_name} ${owner.last_name}`
        : "NOT FOUND";
      const requestDate = new Date(item.request_date).toLocaleString("en-gb", {
        day: "numeric",
        year: "numeric",
        month: "long",
      });

      return {
        id: item.id,
        "S/N": index++,
        Owner: owner_name,
        "Date Requested": requestDate,
        Branch: item.branch.name,
        Status: item.status,
        Actions: [
          {
            name: "View",
            url: `/admin/operations-users/${item.id}`,
          },
          {
            name: "Verify",
            url: `/admin/operations-users/${item.id}`,
          },
          {
            name: "Reject",
            url: `/admin/operations-users/${item.id}`,
          },
        ],
      };
    });
    return list;
  };
  const filteredList = generateList(data);
  return (
    <Admin
      list={filteredList}
      title={title}
      description={description}
      options={officerOptions}
    />
  );
}
