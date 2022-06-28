import RequestsAdmin from "../../../components/requests-admin";
import { officerOptions } from "./index";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";

export async function getServerSideProps() {
  const sectorRes = await fetch(`http://localhost:5000/api/sectors/`);
  const sectorRaw = await sectorRes.json();
  const sectors = sectorRaw.data;
  const res = await fetch(`http://localhost:5000/api/formalization-requests`);
  const owners_res = await fetch(`http://localhost:5000/api/owners`);
  const owners_raw = await owners_res.json();
  const owners = owners_raw.data;
  const data = await res.json();
  const title = "Formalization Requests";
  let index = 1;
  console.log("All sectors", sectors);
  const list = data.data.map((item) => {
    const owner = owners.find((owner) => owner.id == item.owner_id);
    const sector = sectors.find((sector) => {
      const id = parseInt(sector.id);
      return id === owner.sector_id;
    });
    const owner_name = owner
      ? `${owner.first_name} ${owner.last_name}`
      : "NOT FOUND";
    const requestDate = new Date(item.request_date).toLocaleString("en-gb", {
      day: "numeric",
      year: "numeric",
      month: "long",
    });
    console.log("Owner", owner);
    console.log("sector", sector);

    return {
      id: item.id,
      "S/N": index++,
      Owner: owner_name,
      Business: owner.business_name,
      Sector: sector.name,
      owner_data: owner,
      sector_data: sector ? sector : { name: "N/A" },
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
  console.log("sectors", sectors);
  return {
    props: { list, title, description, data: data.data, owners, sectors },
  };
}

export default function Requests({
  list,
  title,
  description,
  data,
  owners,
  sectors,
}) {
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
      const sector = sectors.find((sector) => {
        const id = parseInt(sector.id);
        return id === owner.sector_id;
      });
      const requestDate = new Date(item.request_date).toLocaleString("en-gb", {
        day: "numeric",
        year: "numeric",
        month: "long",
      });
      console.log("sector", sector);
      return {
        id: item.id,
        "S/N": index++,
        Owner: owner_name,
        owner_data: owner,
        sector_data: sector,
        comment_data: item.comment,
        Business: owner.business_name,
        Sector: sector.name,
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
            name: "Unverify",
            url: `/admin/operations-users/${item.id}`,
          },
          {
            name: "Reject",
            url: `/admin/operations-users/${item.id}`,
          },
          {
            name: "Generate",
            url: `/${item.id}/operations-users`,
          },
        ],
      };
    });
    return list;
  };
  const filteredList = generateList(data);
  console.log("filtered ", filteredList);
  return (
    <RequestsAdmin
      list={filteredList}
      title={title}
      description={description}
      options={officerOptions}
    />
  );
}
