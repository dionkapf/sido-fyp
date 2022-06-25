import SimpleCard from "./simple-card";
import { useAuth } from "../context/AuthContext";
import styles from "./AdminDashboard.module.scss";

export default function OfficerDashboard({ cardData }) {
  const { owners, informals, requests } = cardData;
  console.log("cardData", cardData);
  const { user } = useAuth();
  const filteredRequests =
    user && user.branch
      ? requests.list.filter((item) => {
          return item.branch.id == parseInt(user.branch);
        })
      : requests.list;
  console.log("filteredRequests in db", filteredRequests);
  const revisedRequests = {
    list: filteredRequests,
    link: requests.link,
    count: filteredRequests.length,
    title: requests.title,
    description: filteredRequests.length == 1 ? "request" : "requests",
  };
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>BD OFFICER DASHBOARD</h1>
      <div className={styles.cardContainer}>
        <SimpleCard data={owners} />
        <SimpleCard data={informals} />
        <SimpleCard data={revisedRequests} />
      </div>
    </main>
  );
}
