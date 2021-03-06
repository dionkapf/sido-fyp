import RequestsAdmin from "../../../components/requests-admin";
import { trainOptions } from "./index";

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
  const list = data.data.map((item) => {
    const owner = owners.find((owner) => owner.id == item.owner_id);
    const sector = sectors.find((sector) => {
      const id = parseInt(sector.id);
      return id == owner.sector_id;
    });
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
      owner_data: owner,
      sector_data: sector,
      comment_data: item.comment,
      Owner: owner_name,
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
      ],
    };
  });
  console.log("List", list);
  const description =
    list.length == 1 ? "formalization request" : "formalization requests";
  return { props: { list, title, description } };
}

export default function Requests({ list, title, description }) {
  return (
    <RequestsAdmin
      list={list}
      title={title}
      description={description}
      options={trainOptions}
    />
  );
}
