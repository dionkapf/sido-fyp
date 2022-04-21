import Layout from "../components/layout";
import SignIn from "../components/signin";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";

export default function Login() {
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <Layout>
      {/* <form onSubmit={handleSubmit} action="#" method="POST">
        <input type="text" name="username" id="username" />
        <input type="password" name="password" id="password" />
        <input type="submit" value="ENTER" />
      </form> */}
      <SignIn />
    </Layout>
  );
}
