import SimpleCard from "./simple-card";
import MoneyCard from "./money-card";
import styles from "./AdminDashboard.module.scss";

export default function ExecDashboard({ cardData }) {
  const { requests, repayments, managers, amountRequested, amountPaid } =
    cardData;

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>EXECUTIVE DASHBOARD</h1>
      <div className={styles.cardContainer}>
        <SimpleCard data={requests} />
        <SimpleCard data={repayments} />
        <SimpleCard data={managers} />
        <MoneyCard data={amountRequested} />
        <MoneyCard data={amountPaid} />
      </div>
    </main>
  );
}
