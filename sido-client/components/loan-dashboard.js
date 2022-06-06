import SimpleCard from "./simple-card";
import MoneyCard from "./money-card";
import styles from "./AdminDashboard.module.scss";

export default function LoanDashboard({ cardData }) {
  const { requests, loans, amountRequested } = cardData;

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>LOAN MANAGER DASHBOARD</h1>
      <div className={styles.cardContainer}>
        <SimpleCard data={requests} />
        <SimpleCard data={loans} />
        <MoneyCard data={amountRequested} />
      </div>
    </main>
  );
}
