import SimpleCard from "./simple-card";
import styles from "./AdminDashboard.module.scss";

export default function AdminDashboard({ cardData }) {
  const { users, executives, operators } = cardData;

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>ADMINISTRATOR DASHBOARD</h1>
      <div className={styles.cardContainer}>
        <SimpleCard data={executives} />
        <SimpleCard data={operators} />
        <SimpleCard data={users} />
      </div>
    </main>
  );
}
