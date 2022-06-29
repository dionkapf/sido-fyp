import { useEffect } from "react";
import { useRouter } from "next/router";

import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

import styles from "../styles/Homepage.module.css";

import { useAuth } from "../context/AuthContext";
import Footer from "../components/footer";
import MenuAppBar from "../components/menuappbar";

export default function Home() {
  const { user, setUser, isLoading, setIsLoading } = useAuth();
  const name = user
    ? `Welcome back, ${user.first_name}`
    : "Welcome to RASMISHA, Formalization and Loan Services ";
  const router = useRouter();

  const checkFormalization = () => {
    if (user) {
      console.log("User exists for formalizing");
      if (user.formalized) {
        console.log("User is formalized", user.formalized);
        return false;
      } else return true;
    } else {
      console.log("Locked and loadeed");
      return true;
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>RASMISHA</title>
        <meta name="description" content="Rasmisha App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MenuAppBar />
      <main className={styles.main}>
        <div className={styles.hero}>
          
          <div className={styles.heroText}>
            <h1 className={styles.title}>{name}</h1>
          </div>
        </div>

        <div className={styles.grid}>
          <div className={styles.card}>
            <Link href="/loan-info" className={styles.active} passHref>
              <div>
                <Image
                  src="/../public/loan-info.jpg"
                  alt="Loan Info"
                  width={250}
                  height={150}
                />
                <h2>Apply for a loan &rarr;</h2>
                <p>
                  Get up to TSh 15,000,000 in start up capital for your business
                </p>
              </div>
            </Link>
          </div>
          {checkFormalization() && (
            <div className={styles.card}>
              <Link href="/form-info" passHref className={styles.card}>
                <div>
                  <Image
                    src="/../public/form-info2.jpg"
                    alt="Formalization"
                    width={250}
                    height={150}
                    style={{ borderRadius: "10px" }}
                  />

                  <h2>Rasmilishe &rarr;</h2>
                  <p>
                    Start the process of formalizing your business and earn your
                    rights
                  </p>
                </div>
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
