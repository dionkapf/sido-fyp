import Head from "next/head";
import styles from "./layout.module.css";
import Sidebar from "./sidebar";

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>Layouts Example</title>
      </Head>
      <Sidebar />
      <main className={styles.main}>{children}</main>
    </>
  );
}
