import Head from "next/head";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import Footer from "../components/footer";
import { useAuth } from "../context/AuthContext";
import { useEffect, useRef } from "react";
import MenuAppBar from "../components/menuappbar";

export default function ApplyLoan() {
  const { user, setUser, isLoading, setIsLoading } = useAuth();
  const title = useRef("Welcome to the SIDO APP");
  const name = user
    ? `Welcome back, ${user.first_name}`
    : "Welcome to the SIDO APP";
  const formalized = true;
  useEffect(() => {
    // console.log("Formalized", user.formalized);
  }, [name, user]);
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
        <h1>
          LOAN TIME
        </h1>
      </main>

      <Footer />
    </div>
  );
}
