import Layout from "../components/layout";
import RegisterForm from "../components/register-form";

export default function Login() {
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <Layout>
      <RegisterForm />
    </Layout>
  );
}
