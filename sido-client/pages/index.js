import Head from "next/head";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import Footer from "../components/footer";
import { useAuth } from "../context/AuthContext";
import { useEffect, useRef } from "react";
import MenuAppBar from "../components/menuappbar";

export default function Home() {
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
        <div className={styles.grid}>
          <div className={styles.card}>
            <Link href="/apply-loan" className={styles.active} passHref>
              <div>
                <h2>Apply for a loan &rarr;</h2>
                <p>
                  Get up to TSh 15,000,000 in start up capital for your business
                </p>
              </div>
            </Link>
          </div>

          <a href="/form-request" className={styles.card}>
            <h2>Rasmilishe  &rarr;</h2>
            <p>
              Start the process of formalizing your business and earn your
              rights
            </p>
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
