import Layout from "../components/layout";
import RegisterBusinessForm from "../components/register-business-form";

export async function getServerSideProps() {
  const sectorRes = await fetch("http://localhost:5000/api/sectors", {
    method: "GET",
    credentials: "include",
  });
  {
    const sectorsJSON = await sectorRes.json();
    if (sectorsJSON === null) {
      return {
        props: {
          sectors: ["null", "null", "null"],
        },
      };
    }
    const sectors = sectorsJSON.data;
    // const x = JSON.stringify(sectorsJSON);
    return {
      props: {
        sectors: sectors,
      },
    };
  }
}

export default function RegisterBusiness({ sectors }) {
  return (
    <Layout>
      <RegisterBusinessForm sectors={sectors} />
    </Layout>
  );
}
