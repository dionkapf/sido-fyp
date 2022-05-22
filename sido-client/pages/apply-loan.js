import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import Footer from "../components/footer";
import { useAuth } from "../context/AuthContext";
import { useEffect, useRef } from "react";
import MenuAppBar from "../components/menuappbar";
import LoanRequest from "../components/loan-request";

export async function getServerSideProps() {
  const res = await fetch(`http://localhost:5000/api/branches`);
  const data = await res.json();
  const branches = data.data;
  return { props: { branches } };
}

export default function ApplyLoan({ branches }) {
  const { user, setUser, isLoading, setIsLoading } = useAuth();
  const title = useRef("Welcome to the SIDO APP");
  const router = useRouter();
  const name = user
    ? `Welcome back, ${user.first_name}`
    : "Welcome to the SIDO APP";
  const formalized = true;
  useEffect(() => {
    if (!user) {
      console.log("User is not logged in");
      router.push("/login");
    }
  }, [user, router]);
  return (
    <div className={styles.container}>
      <Head>
        <title>SIDO APP</title>
        <meta name="description" content="SIDO Loan and Formalise App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MenuAppBar />
      <main className={styles.main}>
        <h1 className={styles.title}>{name}</h1>

        <p className={styles.description}>What would you like to do today?</p>
        <LoanRequest branches={branches} />
      </main>

      <Footer />
    </div>
  );
}
