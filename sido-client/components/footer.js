import Image from "next/image";
import styles from "../styles/Home.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {"Copyright © Rasmisha App "}
      {new Date().getFullYear()}
      {"."}
    </footer>
  );
}
