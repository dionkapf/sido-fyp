import SimpleCard from "./simple-card";
import styles from "./AdminDashboard.module.scss";

export default function OpsDashboard({ cardData }) {
  // @TODO - Add card data to the component
  const { users, executives, operators } = cardData;

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>OPERATOR DASHBOARD</h1>
      <div className={styles.cardContainer}>
        <SimpleCard data={executives} />
        <SimpleCard data={operators} />
        <SimpleCard data={users} />
      </div>
    </main>
  );
}
