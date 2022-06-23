import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import Footer from "../components/footer";
import { useAuth } from "../context/AuthContext";
import { useEffect, useRef } from "react";
import MenuAppBar from "../components/menuappbar";
import LoanRequest from "../components/loan-request";
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

export default function ApplyLoan({ branches }) {
  const { user, setUser, isLoading, setIsLoading } = useAuth();
  const title = useRef("Welcome to RASMIKOPO");
  const router = useRouter();
  const classes = useStyles();
  const name = user
    ? `Welcome back, ${user.first_name}`
    : "Welcome to RASMIKOPO";
  const formalized = true;
  useEffect(() => {
    console.log("USe effect user", user);
    if (!user) {
      console.log("User is not logged in");
      router.push("/login");
    }
  }, [user, router]);
  return (
    <div className={classes.container}>
      <Head>
        <title>Loan Application</title>
        <meta name="description" content="SIDO Loan and Formalise App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MenuAppBar />
      <main className={classes.main}>
        <h1 className={styles.title}>Apply for a loan</h1>
        <LoanRequest branches={branches} />
      </main>

      <Footer />
    </div>
  );
}
