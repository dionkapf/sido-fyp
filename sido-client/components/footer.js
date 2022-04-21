import Image from "next/image";
import styles from "../styles/Home.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {"Copyright © SIDO Loan and Formalise App "}
      {new Date().getFullYear()}
      {"."}
    </footer>
  );
}
