import SimpleCard from "./simple-card";
import styles from "./AdminDashboard.module.scss";

export default function TrainDashboard({ cardData }) {
  const { officers, requests, informal } = cardData;

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>TRAINING MANAGER DASHBOARD</h1>
      <div className={styles.cardContainer}>
        <SimpleCard data={officers} />
        <SimpleCard data={requests} />
      </div>
    </main>
  );
}
