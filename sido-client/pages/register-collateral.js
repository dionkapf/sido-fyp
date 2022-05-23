import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import Footer from "../components/footer";
import { useAuth } from "../context/AuthContext";
import { useLoanRequest } from "../context/LoanRequestContext";
import { useEffect, useRef } from "react";
import MenuAppBar from "../components/menuappbar";
import AddCollateral from "../components/add-collateral";
import { makeStyles } from "@material-ui/core";

export async function getServerSideProps() {
  const res = await fetch(`http://localhost:5000/api/branches`);
  const data = await res.json();
  const branches = data.data;
  return { props: { branches } };
}

const useStyles = makeStyles((theme) => ({
  main: {
    minHeight: "75vh",
    padding: "2rem 0",
    flex: "1",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    padding: "0 0rem",
  },
}));

export default function RegisterCollateral({ branches }) {
  const { user } = useAuth();
  const { loanRequest } = useLoanRequest();
  const router = useRouter();
  const classes = useStyles();
  useEffect(() => {
    if (!user) {
      console.log("User is not logged in");
      router.push("/login");
    }
  }, [user, router]);
  return (
    <div className={classes.container}>
      <Head>
        <title>Add collateral for loan</title>
        <meta name="description" content="SIDO Loan and Formalise App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MenuAppBar />
      <main className={classes.main}>
        <h1 className={styles.title}>Register collateral</h1>
        <AddCollateral />
      </main>

      <Footer />
    </div>
  );
}
