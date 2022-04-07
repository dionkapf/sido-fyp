import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import Footer from "../components/footer";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>SIDO APP</title>
        <meta name="description" content="SIDO Loan and Formalise App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to the SIDO APP</h1>

        <p className={styles.description}>
          The backend is served on
          <code className={styles.code}>http://localhost:5000/</code>
        </p>
        <div className={styles.grid}>
          <div className={styles.card}>
            <Link href="/layout" className={styles.active} passHref>
              <div>
                <h2>Documentation &rarr;</h2>
                <p>Find in-depth information about Next.js features and API.</p>
              </div>
            </Link>
          </div>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h2>Learn &rarr;</h2>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
