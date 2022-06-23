import Layout from "../components/layout";
import WitnessRegister from "../components/witness-register";

export default function Login() {
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <Layout>
      <WitnessRegister />
    </Layout>
  );
}
