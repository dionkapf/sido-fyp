import Head from "next/head";
import styles from "./layout.module.scss";
import Sidebar from "./sidebar";
import MenuAppBar from "./menuappbar";
import Footer from "./footer";

export default function DashboardLayout({ children, title, sidebarOptions }) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <MenuAppBar />
      <div className={styles.container}>
        <Sidebar className={styles.sidebar} options={sidebarOptions} />
        <main className={styles.main}>{children}</main>
      </div>
      <Footer />
    </>
  );
}
