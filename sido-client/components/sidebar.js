import Link from "next/link";
import styles from "./sidebar.module.scss";

export default function Sidebar({ options }) {
  if (!options) {
    options = [
      {
        label: "Home",
        href: "/",
      },
      {
        label: "About",
        href: "/about",
      },
      {
        label: "Contact",
        href: "/contact",
      },
    ];
    console.log("Sidebar options", options);
  }
  return (
    <nav className={styles.nav}>
      {options.map((option) => (
        <Link href={option.href} key={option.label}>
          <a className={styles.link}>{option.label}</a>
        </Link>
      ))}
    </nav>
  );
}
