import Head from "next/head";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import Footer from "../components/footer";
import { useAuth } from "../context/AuthContext";
import MenuAppBar from "../components/menuappbar";

export default function Home() {
  const { user, setUser, isLoading, setIsLoading } = useAuth();
  const name = user
    ? `Welcome back, ${user.first_name}`
    : "Welcome to the SIDO APP";

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
          {checkFormalization() && (
            <div className={styles.card}>
              <Link href="/form-request" passHref className={styles.card}>
                <div>
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
