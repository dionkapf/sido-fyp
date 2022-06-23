import Admin from "../../../components/admin";
import { officerOptions } from "./index";
import { useRouter } from "next/router";
import { useAuth } from "../../../context/AuthContext";
import { useEffect } from "react";

export async function getServerSideProps() {
  const res = await fetch(`http://localhost:5000/api/owners`);
  const data = await res.json();
  const title = "Business Owners";
  let index = 1;
  const list = data.data.map((item) => {
    const full_name = `${item.first_name} ${item.last_name}`;
    const birthday = new Date(item.birthdate).toLocaleString("en-gb", {
      day: "numeric",
      year: "numeric",
      month: "long",
    });
    const sex = item.sex == "M" ? "Male" : item.sex == "F" ? "Female" : "Other";
    const status = item.formalized ? "Formal" : "Informal";
    const role =
      item.role == 2 ? "Financial Services Manager" : "Training Manager";

    return {
      "S/N": index++,
      Name: full_name,
      Phone: item.phone_number,
      Email: item.email,
      BirthDay: birthday,
      Sex: sex,
      Business: item.business_name,
      Actions: [
        {
          name: "View",
          url: `/admin/owners/${item.id}`,
        },
        {
          name: "Edit",
          url: `/admin/owners/${item.id}`,
        },
      ],
    };
  });
  const description = list.length == 1 ? "owner" : "owners";
  return { props: { list, title, description } };
}

export default function Owners({ list, title, description }) {
  console.log("list", list);
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
  return (
    <Admin
      list={list}
      title={title}
      description={description}
      options={officerOptions}
    />
  );
}
