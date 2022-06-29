import Layout from "../components/layout";
import SignIn from "../components/signin";
import Head from "next/head";

export default function Login() {
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <Layout>
      <Head>
        <title>Login</title>
        <meta name="description" content="Rasmisha App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SignIn />
    </Layout>
  );
}
